<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$convex/_generated/api.js';
	import type { Id } from '$convex/_generated/dataModel.js';
	import Suspense from '$lib/components/Suspense.svelte';
	import { useQuery } from 'convex-svelte';
	import Editor from './Editor.svelte';

	let { data } = $props();

	const query = useQuery(api.invoices.getFull, () => ({
		id: data.invoiceId as Id<'invoices'>,
	}));

	const timeEntriesQuery = useQuery(api.timeEntries.list, () => ({
		companyId: data.companyId as Id<'companies'>,
	}));
</script>

<Suspense {query} class="h-[60vh]">
	{#snippet children(data)}
		<Suspense query={timeEntriesQuery}>
			{#snippet children(timeEntries)}
				{#if !data}
					<div class="flex h-full items-center justify-center">
						<p>Kunde nicht gefunden</p>
					</div>
				{:else}
					<Editor
						customer={data.customer}
						invoice={data.invoice}
						company={data.company}
						timeEntries={timeEntries}
					/>
				{/if}
			{/snippet}
		</Suspense>
	{/snippet}
</Suspense>
