import { redirect, fail } from '@sveltejs/kit'
import { pipeline_instance } from '$lib/server/pipeline'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = ({ cookies }) => {
	if (cookies.get('session')) {
		redirect(303, '/customers')
	}
	return {}
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData()
		const username = String(data.get('username') ?? '')
		const password = String(data.get('password') ?? '')

		try {
			const session = await pipeline_instance.authenticate({ username, password })
			cookies.set('session', session.organization_id, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7, // 1 week
			})
		} catch {
			return fail(401, { error: 'Authentication failed' })
		}

		redirect(303, '/customers')
	},
}
