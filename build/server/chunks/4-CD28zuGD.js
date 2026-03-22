import { p as pipeline_instance } from './pipeline-C-0c1EUe.js';
import { fail, redirect } from '@sveltejs/kit';
import './shared-server-9-2j12mp.js';
import 'postgres';

//#region src/routes/login/+page.server.ts
var load = ({ cookies }) => {
	if (cookies.get("session")) redirect(303, "/customers");
	return {};
};
var actions = { default: async ({ request, cookies }) => {
	const data = await request.formData();
	const username = String(data.get("username") ?? "");
	const password = String(data.get("password") ?? "");
	try {
		const session = await pipeline_instance.authenticate({
			username,
			password
		});
		cookies.set("session", session.organization_id, {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			maxAge: 3600 * 24 * 7
		});
	} catch {
		return fail(401, { error: "Authentication failed" });
	}
	redirect(303, "/customers");
} };

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

const index = 4;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BYtM6ccJ.js')).default;
const server_id = "src/routes/login/+page.server.ts";
const imports = ["_app/immutable/nodes/4.BmA2IW6m.js","_app/immutable/chunks/BnXA-dti.js","_app/immutable/chunks/DXLwiZ0H.js"];
const stylesheets = ["_app/immutable/assets/4.DySPq7GW.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-CD28zuGD.js.map
