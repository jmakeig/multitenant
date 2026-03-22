import { create_pipeline, type auth_provider } from '../src/lib/server/api.js'
import { sql } from '../src/lib/server/db/client.js'

function assert(condition: boolean, message: string): void {
	if (!condition) throw new Error(`Assertion failed: ${message}`)
}

function make_stub_provider(organization_id: string): auth_provider {
	return {
		async authenticate(_creds) {
			return { organization_id }
		},
	}
}

async function run() {
	const pipeline_a = create_pipeline(make_stub_provider('placeholder'))

	// 1. Create two organizations
	const org_a = await pipeline_a.create_organization('Org A')
	const org_b = await pipeline_a.create_organization('Org B')
	console.log('Created orgs:', org_a.id, org_b.id)

	// 2. Authenticate as org A, create a customer
	const session_a = await create_pipeline(make_stub_provider(org_a.id))
		.authenticate({ username: '', password: '' })
	const c = await session_a.create_customer({ name: 'Acme', email: 'contact@acme.com' })
	console.log('Created customer:', c.id, c.name)

	// 3. Org A can list its own customer
	const list_a = await session_a.list_customers()
	assert(list_a.some(x => x.id === c.id), 'org A should see its own customer')
	console.log('Org A sees its customer ✓')

	// 4. Org B cannot see org A's customer (RLS isolation)
	const session_b = await create_pipeline(make_stub_provider(org_b.id))
		.authenticate({ username: '', password: '' })
	const list_b = await session_b.list_customers()
	assert(!list_b.some(x => x.id === c.id), 'org B should NOT see org A\'s customer')
	console.log('Org B cannot see org A\'s customer ✓')

	await sql.end()
	console.log('All assertions passed.')
}

run().catch(err => {
	console.error(err)
	process.exit(1)
})
