import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import postgres from 'postgres'
import { create_pipeline } from '../../src/lib/server/api.js'
import { sql } from '../../src/lib/server/db/client.js'

// Superuser connection for test isolation — bypasses RLS to truncate tables
const admin = postgres(process.env.DATABASE_URL!)

beforeEach(async () => {
	await admin`TRUNCATE organization CASCADE`
})

afterAll(async () => {
	await admin`TRUNCATE organization CASCADE`
	await admin.end()
	await sql.end()
})

// Builds a pipeline whose auth provider returns a preset organization_id
function make_pipeline(organization_id: string) {
	return create_pipeline({
		authenticate: async () => ({ organization_id }),
	})
}

describe('create_organization', () => {
	it('creates an organization and returns its row', async () => {
		const pipeline = make_pipeline('unused')
		const org = await pipeline.create_organization('Test Org')

		expect(org.id).toBeTruthy()
		expect(org.name).toBe('Test Org')
		expect(org.created_at).toBeInstanceOf(Date)
	})
})

describe('create_customer', () => {
	it('creates a customer scoped to the organization', async () => {
		const pipeline = make_pipeline('unused')
		const org = await pipeline.create_organization('Org A')
		const session = pipeline.create_session(org.id)

		const customer = await session.create_customer({ name: 'Acme', email: 'acme@example.com' })

		expect(customer.id).toBeTruthy()
		expect(customer.name).toBe('Acme')
		expect(customer.email).toBe('acme@example.com')
		expect(customer.organization_id).toBe(org.id)
	})

	it('stores optional metadata', async () => {
		const pipeline = make_pipeline('unused')
		const org = await pipeline.create_organization('Org A')
		const session = pipeline.create_session(org.id)

		const customer = await session.create_customer({
			name: 'Acme',
			metadata: { tier: 'enterprise' },
		})

		expect(customer.metadata).toEqual({ tier: 'enterprise' })
	})
})

describe('list_customers', () => {
	it('returns customers belonging to the organization', async () => {
		const pipeline = make_pipeline('unused')
		const org = await pipeline.create_organization('Org A')
		const session = pipeline.create_session(org.id)

		await session.create_customer({ name: 'Acme' })
		await session.create_customer({ name: 'Globex' })

		const list = await session.list_customers()

		expect(list).toHaveLength(2)
		expect(list.map(c => c.name)).toContain('Acme')
		expect(list.map(c => c.name)).toContain('Globex')
	})

	it('returns an empty list for a new organization', async () => {
		const pipeline = make_pipeline('unused')
		const org = await pipeline.create_organization('Org A')
		const session = pipeline.create_session(org.id)

		const list = await session.list_customers()

		expect(list).toHaveLength(0)
	})
})

describe('RLS isolation', () => {
	it('org B cannot see customers belonging to org A', async () => {
		const pipeline = make_pipeline('unused')
		const org_a = await pipeline.create_organization('Org A')
		const org_b = await pipeline.create_organization('Org B')

		const session_a = pipeline.create_session(org_a.id)
		await session_a.create_customer({ name: 'Acme' })

		const session_b = pipeline.create_session(org_b.id)
		const list_b = await session_b.list_customers()

		expect(list_b).toHaveLength(0)
	})

	it('each org only sees its own customers', async () => {
		const pipeline = make_pipeline('unused')
		const org_a = await pipeline.create_organization('Org A')
		const org_b = await pipeline.create_organization('Org B')

		const session_a = pipeline.create_session(org_a.id)
		const session_b = pipeline.create_session(org_b.id)

		await session_a.create_customer({ name: 'Acme' })
		await session_b.create_customer({ name: 'Globex' })

		const list_a = await session_a.list_customers()
		const list_b = await session_b.list_customers()

		expect(list_a).toHaveLength(1)
		expect(list_a[0].name).toBe('Acme')
		expect(list_b).toHaveLength(1)
		expect(list_b[0].name).toBe('Globex')
	})
})
