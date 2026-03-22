# Multitenant Sales Pipeline — Instructions

## Conventions

- **tabs** for indentation in every file type, not spaces
- **snake_case** for all TypeScript/JavaScript identifiers: variable names, function names, interface names, type properties, and file names.
- **Singular** names for database tables: `customer`, `organization`, `workload`, `event` — never plural.

## Tech Stack

- **DB driver**: `postgres` (postgres.js) — no camelCase transform; snake_case column names map directly to snake_case TypeScript interfaces. Never use `pg` (node-postgres).
- **Migrations**: plain `.sql` files in `src/migrations/`, applied by `src/db/migrate.ts`. Run with `npm run migrate`.
- **TypeScript**: strict mode, `module: NodeNext`.
- **No HTTP framework** (yet), **no validation library** (no Zod — use TypeScript type guards).

## Environment Variables

- `DATABASE_URL` — superuser connection (postgres/postgres), used only by `migrate.ts`
- `APP_DATABASE_URL` — app_user connection (non-superuser), used by `src/db/client.ts` for all runtime queries

The split is required because PostgreSQL superusers bypass RLS regardless of `FORCE ROW LEVEL SECURITY`.

## Multitenancy: PostgreSQL Row-Level Security

Tenant isolation is enforced at the database layer via RLS — **not** application-level `WHERE organization_id = ...` clauses.

Every DB operation in a session runs inside a transaction that sets the org context first:

```sql
SELECT set_config('app.organization_id', '<uuid>', true)
```

The `true` argument makes the setting local to the current transaction. RLS policies on each tenant-scoped table filter rows automatically using `current_setting('app.organization_id')::uuid`.

Every new tenant-scoped table must include:
```sql
ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;
ALTER TABLE <table> FORCE ROW LEVEL SECURITY;
CREATE POLICY <table>_org_isolation ON <table>
  USING (organization_id = current_setting('app.organization_id')::uuid)
  WITH CHECK (organization_id = current_setting('app.organization_id')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE <table> TO app_user;
```

## Security Model

Two complementary layers:

| Layer | What it prevents |
|---|---|
| `auth_provider` (JWT, future) | External callers forging a different `organization_id` |
| PostgreSQL RLS | Application bugs accidentally leaking cross-tenant data |

## Public API Pattern (`src/api.ts`)

```typescript
const pipeline = create_pipeline(my_auth_provider)
const session  = await pipeline.authenticate({ username: 'alice', password: 'secret' })

// All session methods are automatically scoped to the authenticated org — no org param needed
const customers = await session.list_customers()
const customer  = await session.create_customer({ name: 'Globex' })
```

- `create_pipeline(auth_provider)` wires together the auth provider and DB layer.
- `pipeline.authenticate(credentials)` calls the provider, gets `organization_id`, returns a `session`.
- The `session` object closes over `organization_id`; all its methods set the RLS context before querying.

## Auth Provider Interface

```typescript
export interface auth_provider {
  authenticate(creds: credentials): Promise<{ organization_id: string }>
}
```

This is the seam where JWT plugs in when the HTTP layer is added. The stub provider used in `scripts/smoke.ts` returns a hardcoded `organization_id`. A real JWT implementation verifies the token signature and extracts `organization_id` from the claims — nothing else in the codebase changes.

## postgres.js Transaction Typing

`TransactionSql` in postgres.js extends `Omit<Sql, ...>`, which TypeScript's `Omit` strips call signatures from (a known TypeScript limitation). Use this cast inside `sql.begin` callbacks:

```typescript
await sql.begin(async _tx => {
  const tx = _tx as unknown as Sql
  await tx`SELECT set_config('app.organization_id', ${org_id}, true)`
  // ...
})
```

## Project Structure

```
src/
  api.ts               # Public surface: create_pipeline, pipeline, session
  db/
    client.ts          # postgres.js singleton (APP_DATABASE_URL, non-superuser)
    migrate.ts         # Migration runner (DATABASE_URL, superuser)
  migrations/          # SQL files named NNN_description.sql, applied in lexical order
  types/
    auth.ts            # credentials, auth_provider, session
    customer.ts        # customer, create_customer_input
scripts/
  smoke.ts             # End-to-end isolation test using a stub auth provider
```

## Svelte Components

- Wrap each form control (label, input/select/textarea, help text, error text) in a `<div class="control">`.
- Use explicit `for`/`id` pairs on labels and inputs — do not nest inputs inside labels.
- No CSS or inline styles. Styling is handled separately.
