import * as server from '../entries/pages/customers/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/customers/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/customers/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.eJCbMQ1H.js","_app/immutable/chunks/BnXA-dti.js","_app/immutable/chunks/D-kO2Gjq.js","_app/immutable/chunks/DXLwiZ0H.js"];
export const stylesheets = ["_app/immutable/assets/3.Bb3Kasps.css"];
export const fonts = [];
