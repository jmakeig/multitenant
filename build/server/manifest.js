const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.BBHWQZQC.js",app:"_app/immutable/entry/app.Cnol2NKK.js",imports:["_app/immutable/entry/start.BBHWQZQC.js","_app/immutable/chunks/BnXA-dti.js","_app/immutable/chunks/D-kO2Gjq.js","_app/immutable/entry/app.Cnol2NKK.js","_app/immutable/chunks/BnXA-dti.js","_app/immutable/chunks/BcgnSMxp.js","_app/immutable/chunks/DXLwiZ0H.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-BR_D4NKy.js')),
			__memo(() => import('./chunks/1-DG0NIsCU.js')),
			__memo(() => import('./chunks/2-ByVpkHS5.js')),
			__memo(() => import('./chunks/3-DsJMI97a.js')),
			__memo(() => import('./chunks/4-CD28zuGD.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/customers",
				pattern: /^\/customers\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/logout",
				pattern: /^\/logout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-9OIrM9qV.js'))
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
