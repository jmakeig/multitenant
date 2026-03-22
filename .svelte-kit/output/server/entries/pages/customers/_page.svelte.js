import "../../../chunks/internal.js";
import "../../../chunks/environment.js";
import "../../../chunks/shared.js";
import "../../../chunks/exports.js";
import { _ as escape_html, g as attr, n as ensure_array_like } from "../../../chunks/server.js";
import "../../../chunks/client.js";
//#region src/routes/customers/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, form } = $$props;
		let name = "";
		let email = "";
		$$renderer.push(`<main class="svelte-hmlmb2"><h1>Customers</h1> `);
		if (data.customers.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p>No customers yet.</p>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<table class="svelte-hmlmb2"><thead><tr><th class="svelte-hmlmb2">Name</th><th class="svelte-hmlmb2">Email</th><th class="svelte-hmlmb2">Created</th></tr></thead><tbody><!--[-->`);
			const each_array = ensure_array_like(data.customers);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let customer = each_array[$$index];
				$$renderer.push(`<tr><td class="svelte-hmlmb2">${escape_html(customer.name)}</td><td class="svelte-hmlmb2">${escape_html(customer.email ?? "—")}</td><td class="svelte-hmlmb2">${escape_html(new Date(customer.created_at).toLocaleDateString())}</td></tr>`);
			}
			$$renderer.push(`<!--]--></tbody></table>`);
		}
		$$renderer.push(`<!--]--> <h2>Add customer</h2> `);
		if (form?.error) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="error svelte-hmlmb2">${escape_html(form.error)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <form method="POST" action="?/create" class="svelte-hmlmb2"><label class="svelte-hmlmb2">Name <input type="text" name="name"${attr("value", name)} required=""/></label> <label class="svelte-hmlmb2">Email <input type="email" name="email"${attr("value", email)}/></label> <button type="submit">Add customer</button></form></main>`);
	});
}
//#endregion
export { _page as default };
