import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.Cyl-aqKj.js","_app/immutable/chunks/BnXA-dti.js","_app/immutable/chunks/DXLwiZ0H.js"];
export const stylesheets = [];
export const fonts = [];
