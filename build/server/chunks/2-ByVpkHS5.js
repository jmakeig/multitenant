import { redirect } from '@sveltejs/kit';

//#region src/routes/+page.server.ts
var load = () => {
	redirect(303, "/customers");
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 2;
const server_id = "src/routes/+page.server.ts";
const imports = [];
const stylesheets = [];
const fonts = [];

export { fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=2-ByVpkHS5.js.map
