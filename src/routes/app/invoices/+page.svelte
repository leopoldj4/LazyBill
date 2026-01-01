<script lang="ts">
	import { api } from '$convex/_generated/api';
	import InvoiceStateSelect from '$lib/components/InvoiceStateSelect.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import Suspense from '$lib/components/Suspense.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { daysUntilDue } from '$lib/date';
	import { useQuery } from 'convex-svelte';

	const query = useQuery(api.invoices.list, {});
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item>Rechnungen</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>

<SiteHeader>Rechnungen</SiteHeader>

<Suspense {query}>
	{#snippet children(invoices)}
		{#if invoices.length === 0}
			<div class="flex h-full items-center justify-center">
				<p>Keine Rechnungen gefunden</p>
			</div>
		{:else}
			{#each invoices.toSorted((a, b) => {
				const aDue = new Date(a.date).getTime() + a.dueInDays * 86400000;
				const bDue = new Date(b.date).getTime() + b.dueInDays * 86400000;
				return aDue - bDue;
			}) as invoice}
				<div class="grid grid-cols-4 items-center rounded-lg border px-8 py-4">
					<a
						class="flex flex-col gap-2"
						href={`/app/customers/${invoice.customer?._id}/invoices/${invoice._id}`}
					>
						<h3 class="text-lg">#{invoice.number}</h3>
						<p class="text-sm text-gray-500">{invoice.customer?.name ?? 'Unbekannt'}</p>
					</a>
					<div>Fällig in {daysUntilDue(invoice.date, invoice.dueInDays)} Tagen</div>
					<InvoiceStateSelect value={invoice.state} invoiceId={invoice._id} />
					<div class="text-lg">
						{invoice.articles.reduce((acc, article) => acc + article.price, 0)} €
					</div>
				</div>
			{/each}
		{/if}
	{/snippet}
</Suspense>

{#snippet Heading(title: string)}
	<h2 class="text-2xl">{title}</h2>
{/snippet}

{@render Heading('Überfällig')}
{@render Heading('Offen')}
{@render Heading('Archiv')}
