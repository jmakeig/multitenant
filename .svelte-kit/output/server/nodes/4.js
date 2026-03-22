import * as server from '../entries/pages/login/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/login/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/login/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.BmA2IW6m.js","_app/immutable/chunks/BnXA-dti.js","_app/immutable/chunks/DXLwiZ0H.js"];
export const stylesheets = ["_app/immutable/assets/4.DySPq7GW.css"];
export const fonts = [];
