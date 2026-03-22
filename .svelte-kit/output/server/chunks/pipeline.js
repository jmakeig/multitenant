import { n as private_env } from "./shared-server.js";
import postgres from "postgres";
//#region src/lib/server/db/client.ts
var sql = postgres(private_env.APP_DATABASE_URL);
//#endregion
//#region src/lib/server/api.ts
function make_session(organization_id) {
	return {
		organization_id,
		async create_customer(input) {
			return (await sql.begin(async (_tx) => {
				const tx = _tx;
				await tx`SELECT set_config('app.organization_id', ${organization_id}, true)`;
				const metadata = input.metadata ?? null;
				return await tx`
					INSERT INTO customer (organization_id, name, email, metadata)
					VALUES (
						${organization_id},
						${input.name},
						${input.email ?? null},
						${metadata}
					)
					RETURNING *
				`;
			}))[0];
		},
		async list_customers() {
			return sql.begin(async (_tx) => {
				const tx = _tx;
				await tx`SELECT set_config('app.organization_id', ${organization_id}, true)`;
				return await tx`SELECT * FROM customer ORDER BY created_at DESC`;
			});
		}
	};
}
function create_pipeline(provider) {
	return {
		async authenticate(creds) {
			const { organization_id } = await provider.authenticate(creds);
			return make_session(organization_id);
		},
		async create_organization(name) {
			const [row] = await sql`
				INSERT INTO organization (name) VALUES (${name}) RETURNING *
			`;
			return row;
		},
		create_session(organization_id) {
			return make_session(organization_id);
		}
	};
}
var pipeline_instance = create_pipeline({ async authenticate(_creds) {
	const rows = await sql`
			SELECT id FROM organization WHERE name = 'Demo Org' LIMIT 1
		`;
	if (rows.length > 0) return { organization_id: rows[0].id };
	const [org] = await sql`
			INSERT INTO organization (name) VALUES ('Demo Org') RETURNING id
		`;
	return { organization_id: org.id };
} });
//#endregion
export { pipeline_instance as t };
