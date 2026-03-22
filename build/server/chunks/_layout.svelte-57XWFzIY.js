//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, children } = $$props;
		if (data.organization_id) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<nav><a href="/customers">Customers</a> <form method="POST" action="/logout"><button type="submit">Log out</button></form></nav>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		children($$renderer);
		$$renderer.push(`<!---->`);
	});
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-57XWFzIY.js.map
