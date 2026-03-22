import { sql } from './db/client.js'
import type { Sql } from 'postgres'
import type { auth_provider, credentials, session } from './types/auth.js'
import type { customer, create_customer_input } from './types/customer.js'

export type { auth_provider, credentials, session } from './types/auth.js'
export type { customer, create_customer_input } from './types/customer.js'

export interface organization {
	id: string
	name: string
	created_at: Date
}

export interface pipeline {
	authenticate(creds: credentials): Promise<session>
	create_organization(name: string): Promise<organization>
}

// TransactionSql extends Omit<Sql, ...> which loses call signatures due to a TypeScript
// limitation with Omit on callable types. The cast is safe — tx is callable at runtime.
type callable_sql = Sql

function make_session(organization_id: string): session {
	return {
		organization_id,

		async create_customer(input: create_customer_input): Promise<customer> {
			const rows = await sql.begin(async _tx => {
				const tx = _tx as unknown as callable_sql
				await tx`SELECT set_config('app.organization_id', ${organization_id}, true)`
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const metadata = (input.metadata ?? null) as any
				const result = await tx<customer[]>`
					INSERT INTO customer (organization_id, name, email, metadata)
					VALUES (
						${organization_id},
						${input.name},
						${input.email ?? null},
						${metadata}
					)
					RETURNING *
				`
				return result
			})
			return rows[0]
		},

		async list_customers(): Promise<customer[]> {
			return sql.begin(async _tx => {
				const tx = _tx as unknown as callable_sql
				await tx`SELECT set_config('app.organization_id', ${organization_id}, true)`
				const result = await tx<customer[]>`SELECT * FROM customer ORDER BY created_at DESC`
				return result
			})
		},
	}
}

export function create_pipeline(provider: auth_provider): pipeline {
	return {
		async authenticate(creds: credentials): Promise<session> {
			const { organization_id } = await provider.authenticate(creds)
			return make_session(organization_id)
		},

		async create_organization(name: string): Promise<organization> {
			const [row] = await sql<organization[]>`
				INSERT INTO organization (name) VALUES (${name}) RETURNING *
			`
			return row
		},
	}
}
