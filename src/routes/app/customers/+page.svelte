<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import PlusIcon from '@lucide/svelte/icons/plus';

	const { data } = $props();
</script>

<div>
	<h1 class="text-2xl font-bold">Customers</h1>
	<div class="mt-4 flex flex-row gap-4">
		<a href="/app/customers/new" class={buttonVariants({ variant: 'outline' })}>
			<PlusIcon />
			Add Customer
		</a>
	</div>
	<ul>
		{#each data.customers as customer}
			<li>
				<a href={`/app/customers/${customer.id}`}>{customer.name}</a>
			</li>
		{/each}
	</ul>
</div>
