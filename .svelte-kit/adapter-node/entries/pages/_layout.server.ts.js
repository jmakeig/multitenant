import { redirect } from "@sveltejs/kit";
//#region src/routes/+layout.server.ts
var load = ({ cookies, url }) => {
	const organization_id = cookies.get("session");
	if (!organization_id && url.pathname !== "/login") redirect(303, "/login");
	return { organization_id: organization_id ?? null };
};
//#endregion
export { load };
