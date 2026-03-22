// @ts-nocheck
import { redirect, fail } from '@sveltejs/kit'
import { pipeline_instance } from '$lib/server/pipeline'
import type { Actions, PageServerLoad } from './$types'

export const load = async ({ parent }: Parameters<PageServerLoad>[0]) => {
	const { organization_id } = await parent()
	if (!organization_id) redirect(303, '/login')

	const session = pipeline_instance.create_session(organization_id)
	const customers = await session.list_customers()
	return { customers }
}

export const actions = {
	create: async ({ request, cookies }: import('./$types').RequestEvent) => {
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
;null as any as Actions;