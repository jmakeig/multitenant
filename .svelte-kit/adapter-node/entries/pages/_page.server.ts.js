import { redirect } from "@sveltejs/kit";
//#region src/routes/+page.server.ts
var load = () => {
	redirect(303, "/customers");
};
//#endregion
export { load };
