<script lang="ts">
	import type { ActionData } from './$types'

	let { form }: { form: ActionData } = $props()
</script>

<main>
	<h1>Sign in</h1>
	<form method="POST">
		{#if form?.error}
			<p class="error">{form.error}</p>
		{/if}
		<div class="control">
			<label for="username">Username</label>
			<input id="username" type="text" name="username" autocomplete="username" required />
		</div>
		<div class="control">
			<label for="password">Password</label>
			<input id="password" type="password" name="password" autocomplete="current-password" required />
		</div>
		<button type="submit">Sign in</button>
	</form>
</main>
