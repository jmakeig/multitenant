import { p as pipeline_instance } from './pipeline-C-0c1EUe.js';
import { redirect, fail } from '@sveltejs/kit';
import './shared-server-9-2j12mp.js';
import 'postgres';

//#region src/routes/customers/+page.server.ts
var load = async ({ parent }) => {
	const { organization_id } = await parent();
	if (!organization_id) redirect(303, "/login");
	return { customers: await pipeline_instance.create_session(organization_id).list_customers() };
};
var actions = { create: async ({ request, cookies }) => {
	const organization_id = cookies.get("session");
	if (!organization_id) redirect(303, "/login");
	const data = await request.formData();
	const name = String(data.get("name") ?? "").trim();
	const email = String(data.get("email") ?? "").trim() || void 0;
	if (!name) return fail(400, { error: "Name is required" });
	await pipeline_instance.create_session(organization_id).create_customer({
		name,
		email
	});
	return { success: true };
} };

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

const index = 3;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BoWmn3Zg.js')).default;
const server_id = "src/routes/customers/+page.server.ts";
const imports = ["_app/immutable/nodes/3.eJCbMQ1H.js","_app/immutable/chunks/BnXA-dti.js","_app/immutable/chunks/D-kO2Gjq.js","_app/immutable/chunks/DXLwiZ0H.js"];
const stylesheets = ["_app/immutable/assets/3.Bb3Kasps.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=3-DsJMI97a.js.map
