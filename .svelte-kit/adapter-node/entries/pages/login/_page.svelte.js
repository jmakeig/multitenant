import { _ as escape_html } from "../../../chunks/server.js";
//#region src/routes/login/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { form } = $$props;
		$$renderer.push(`<main class="svelte-1x05zx6"><h1>Sign in</h1> <form method="POST" class="svelte-1x05zx6">`);
		if (form?.error) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="error svelte-1x05zx6">${escape_html(form.error)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <label class="svelte-1x05zx6">Username <input type="text" name="username" autocomplete="username" required=""/></label> <label class="svelte-1x05zx6">Password <input type="password" name="password" autocomplete="current-password" required=""/></label> <button type="submit">Sign in</button></form></main>`);
	});
}
//#endregion
export { _page as default };
