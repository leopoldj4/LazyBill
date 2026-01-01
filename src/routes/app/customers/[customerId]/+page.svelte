<script lang="ts">
	import { useQuery } from 'convex-svelte';
	import CustomerView from './CustomerView.svelte';
	import Suspense from '$lib/components/Suspense.svelte';
	import { api } from '$convex/_generated/api.js';
	import type { Id } from '$convex/_generated/dataModel.js';

	const { data } = $props();

	const query = useQuery(api.customers.getFull, () => ({
		id: data.customerId as Id<'customers'>,
	}));
</script>

<Suspense {query} class="h-[60vh]">
	{#snippet children(data)}
		{#if !data}
			<div class="flex items-center justify-center">
				<p>Kunde nicht gefunden</p>
			</div>
		{:else}
			{@const { customer, invoices, company } = data}
			<CustomerView {customer} {invoices} {company} />
		{/if}
	{/snippet}
</Suspense>
