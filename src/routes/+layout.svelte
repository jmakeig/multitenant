<script lang="ts">
	import type { LayoutData } from './$types'

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props()
</script>

{#if data.organization_id}
	<nav>
		<a href="/customers">Customers</a>
		<form method="POST" action="/logout">
			<button type="submit">Log out</button>
		</form>
	</nav>
{/if}

{@render children()}
