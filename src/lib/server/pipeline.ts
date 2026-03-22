import { create_pipeline, type pipeline } from './api'
import { sql } from './db/client'
import type { auth_provider } from './types/auth'

// Stub auth provider: ignores credentials, looks up or creates "Demo Org",
// returns its organization_id. Replace with a real JWT provider when the
// HTTP auth layer is added — nothing else in the codebase changes.
const stub_provider: auth_provider = {
	async authenticate(_creds) {
		const rows = await sql<{ id: string }[]>`
			SELECT id FROM organization WHERE name = 'Demo Org' LIMIT 1
		`
		if (rows.length > 0) {
			return { organization_id: rows[0].id }
		}
		const [org] = await sql<{ id: string }[]>`
			INSERT INTO organization (name) VALUES ('Demo Org') RETURNING id
		`
		return { organization_id: org.id }
	},
}

export const pipeline_instance: pipeline = create_pipeline(stub_provider)
