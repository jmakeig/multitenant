import { redirect } from '@sveltejs/kit';

//#region src/routes/+layout.server.ts
var load = ({ cookies, url }) => {
	const organization_id = cookies.get("session");
	if (!organization_id && url.pathname !== "/login") redirect(303, "/login");
	return { organization_id: organization_id ?? null };
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 0;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-57XWFzIY.js')).default;
const server_id = "src/routes/+layout.server.ts";
const imports = ["_app/immutable/nodes/0.Cyl-aqKj.js","_app/immutable/chunks/BnXA-dti.js","_app/immutable/chunks/DXLwiZ0H.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=0-BR_D4NKy.js.map
