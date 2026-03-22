import { redirect } from '@sveltejs/kit';

//#region src/routes/logout/+server.ts
var POST = ({ cookies }) => {
	cookies.delete("session", { path: "/" });
	redirect(303, "/login");
};

export { POST };
//# sourceMappingURL=_server.ts-9OIrM9qV.js.map
