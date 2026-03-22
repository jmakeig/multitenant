// @ts-nocheck
import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load = ({ cookies, url }: Parameters<LayoutServerLoad>[0]) => {
	const organization_id = cookies.get('session')
	if (!organization_id && url.pathname !== '/login') {
		redirect(303, '/login')
	}
	return { organization_id: organization_id ?? null }
}
