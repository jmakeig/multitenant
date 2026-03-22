import { t as pipeline_instance } from "../../../chunks/pipeline.js";
import { fail, redirect } from "@sveltejs/kit";
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
//#endregion
export { actions, load };
