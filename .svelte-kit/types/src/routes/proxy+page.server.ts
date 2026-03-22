// @ts-nocheck
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = () => {
	redirect(303, '/customers')
}
;null as any as PageServerLoad;