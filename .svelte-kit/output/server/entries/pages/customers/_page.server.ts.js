import { t as pipeline_instance } from "../../../chunks/pipeline.js";
import { fail, redirect } from "@sveltejs/kit";
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
//#endregion
export { actions, load };
