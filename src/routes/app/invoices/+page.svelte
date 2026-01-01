<script lang="ts">
	import { api } from '$convex/_generated/api';
	import InvoiceStateSelect from '$lib/components/InvoiceStateSelect.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import Suspense from '$lib/components/Suspense.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as Table from '$lib/components/ui/table';
	import { daysUntilDue, parseDate } from '$lib/date';
	import { useQuery } from 'convex-svelte';
	import type { Doc } from '$convex/_generated/dataModel';
	import type { InvoiceState } from '$convex/invoiceState';

	const query = useQuery(api.invoices.list, {});
	const transactionsQuery = useQuery(api.plaid.getAllTransactions, {});

	type Invoice = Doc<'invoices'> & {
		customer: Doc<'customers'> | null;
	};

	function filterState(invoices: Invoice[], state: InvoiceState[]) {
		return invoices.filter((invoice) => state.includes(invoice.state));
	}

	function filterOverdue(invoices: Invoice[]): Invoice[] {
		return invoices.filter((invoice) => daysUntilDue(invoice.date, invoice.dueInDays) < 0);
	}

	function filterNotOverdue(invoices: Invoice[]): Invoice[] {
		return invoices.filter((invoice) => daysUntilDue(invoice.date, invoice.dueInDays) >= 0);
	}

	function sortInvoices<T extends Doc<'invoices'>>(invoices: T[]): T[] {
		return invoices.toSorted((a, b) => {
			const aDue = new Date(a.date).getTime() + a.dueInDays * 86400000;
			const bDue = new Date(b.date).getTime() + b.dueInDays * 86400000;
			return aDue - bDue;
		});
	}
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item>Rechnungen</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>

<SiteHeader>Rechnungen</SiteHeader>

{#if transactionsQuery.data && transactionsQuery.data.length > 0}
	<div class="mb-8">
		<h2 class="mb-4 text-2xl">Transaktionen</h2>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Datum</Table.Head>
					<Table.Head>Name</Table.Head>
					<Table.Head>Betrag</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each transactionsQuery.data as transaction}
					<Table.Row>
						<Table.Cell>{parseDate(transaction.date)}</Table.Cell>
						<Table.Cell>{transaction.merchantName || transaction.name}</Table.Cell>
						<Table.Cell class={transaction.amount < 0 ? 'text-green-600' : 'text-red-600'}>
							{transaction.amount < 0 ? '+' : '-'}{Math.abs(transaction.amount).toFixed(2)} €
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
{/if}

{#snippet Invoices(title: string, invoices: Invoice[])}
	{#if invoices.length > 0}
		<h2 class="text-2xl">{title}</h2>
		{#each invoices as invoice}
			<div class="grid grid-cols-2 items-center gap-4 rounded-lg border px-8 py-4 lg:grid-cols-4">
				<a
					class="flex flex-col lg:gap-2"
					href={`/app/customers/${invoice.customerId}/invoices/${invoice._id}`}
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

<Suspense {query}>
	{#snippet children(invoices)}
		{#if invoices.length == 0}
			<div class="flex min-h-[30vh] flex-col items-center justify-center gap-4">
				<p>Keine Rechnungen gefunden</p>
			</div>
		{/if}
		{@render Invoices('Überfällig', filterOverdue(filterState(invoices, ['new', 'sent'])))}
		{@render Invoices('Offen', filterNotOverdue(filterState(invoices, ['new', 'sent'])))}
		{@render Invoices('Archiviert', filterState(invoices, ['paid', 'cancelled']))}
	{/snippet}
</Suspense>
