import { redirect, fail } from '@sveltejs/kit'
import { pipeline_instance } from '$lib/server/pipeline'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ parent }) => {
	const { organization_id } = await parent()
	if (!organization_id) redirect(303, '/login')

	const session = pipeline_instance.create_session(organization_id)
	const customers = await session.list_customers()
	return { customers }
}

export const actions: Actions = {
	create: async ({ request, cookies }) => {
		const organization_id = cookies.get('session')
		if (!organization_id) redirect(303, '/login')

		const data = await request.formData()
		const name = String(data.get('name') ?? '').trim()
		const email = String(data.get('email') ?? '').trim() || undefined

		if (!name) return fail(400, { error: 'Name is required' })

		const session = pipeline_instance.create_session(organization_id)
		await session.create_customer({ name, email })
		return { success: true }
	},
}
