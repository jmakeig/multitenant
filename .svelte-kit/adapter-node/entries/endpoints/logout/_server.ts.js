import { redirect } from "@sveltejs/kit";
//#region src/routes/logout/+server.ts
var POST = ({ cookies }) => {
	cookies.delete("session", { path: "/" });
	redirect(303, "/login");
};
//#endregion
export { POST };
