<script lang="ts">
	import { enhance } from '$app/forms'
	import type { PageData, ActionData } from './$types'

	let { data, form }: { data: PageData; form: ActionData } = $props()

	let name = $state('')
	let email = $state('')
</script>

<main>
	<h1>Customers</h1>

	{#if data.customers.length === 0}
		<p>No customers yet.</p>
	{:else}
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Email</th>
					<th>Created</th>
				</tr>
			</thead>
			<tbody>
				{#each data.customers as customer (customer.id)}
					<tr>
						<td>{customer.name}</td>
						<td>{customer.email ?? '—'}</td>
						<td>{new Date(customer.created_at).toLocaleDateString()}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}

	<h2>Add customer</h2>
	<form method="POST" action="?/create" use:enhance>
		{#if form?.error}
			<div class="control">
				<p class="error">{form.error}</p>
			</div>
		{/if}
		<div class="control">
			<label for="name">Name</label>
			<input id="name" type="text" name="name" bind:value={name} required />
		</div>
		<div class="control">
			<label for="email">Email</label>
			<input id="email" type="email" name="email" bind:value={email} />
		</div>
		<button type="submit">Add customer</button>
	</form>
</main>
