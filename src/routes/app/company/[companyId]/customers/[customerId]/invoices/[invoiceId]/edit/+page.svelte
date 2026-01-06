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
</script>

<Suspense {query} class="h-[60vh]">
	{#snippet children(data)}
		{#if !data}
			<div class="flex h-full items-center justify-center">
				<p>Kunde nicht gefunden</p>
			</div>
		{:else}
			<Editor customer={data.customer} invoice={data.invoice} company={data.company} />
		{/if}
	{/snippet}
</Suspense>
