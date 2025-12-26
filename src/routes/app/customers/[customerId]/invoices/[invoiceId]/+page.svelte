<script lang="ts">
	import DatePicker from '$lib/components/DatePicker.svelte';
	import Preview from '$lib/components/Preview.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as InputGroup from '$lib/components/ui/input-group';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { invoiceTemplate } from '$lib/typst/invoice.js';
	import CircleMinusIcon from '@lucide/svelte/icons/circle-minus';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { useQuery } from 'convex-svelte';
	import { api } from '$convex/_generated/api.js';
	import type { Id } from '$convex/_generated/dataModel.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import Suspense from '$lib/components/Suspense.svelte';
	import { parseDate } from '$lib/date';
	import { exportPDF } from '$lib/typst/export';

	let { data } = $props();

	const query = useQuery(api.invoices.getFull, () => ({
		id: data.invoiceId as Id<'invoices'>,
	}));

	let due = $state<number | null>(30);
	let articles = $state<Article[]>([{ name: '', price: 0 }]);
	let notes = $state<string>('');

	type Article = {
		name: string;
		price: number;
	};

	let invoiceDate = $derived(query.data ? parseDate(query.data.invoice.date) : undefined);

	let typstDocument = $derived(() => {
		if (!query.data) return '';

		return invoiceTemplate(
			query.data.company,
			query.data.customer,
			articles,
			invoiceDate!,
			query.data.invoiceNumber,
			due || 0,
			notes,
		);
	});

	function exporter() {
		exportPDF(typstDocument());
	}
</script>

<Suspense {query} class="h-[60vh]">
	{#snippet children(data)}
		{#if !data}
			<div class="flex items-center justify-center h-full">
				<p>Kunde nicht gefunden</p>
			</div>
		{:else}
			{@const { customer } = data}
			<div class="grid grid-cols-2 gap-12">
				<div class="flex flex-col gap-8">
					<Breadcrumb.Root>
						<Breadcrumb.List>
							<Breadcrumb.Item>
								<Breadcrumb.Link href="/app/customers">Kunden</Breadcrumb.Link>
							</Breadcrumb.Item>
							<Breadcrumb.Separator />
							<Breadcrumb.Item>
								<Breadcrumb.Link href="/app/customers/{customer._id}"
									>{customer.name}</Breadcrumb.Link
								>
							</Breadcrumb.Item>
							<Breadcrumb.Separator />
							<Breadcrumb.Item>Rechnung #{data.invoiceNumber}</Breadcrumb.Item>
						</Breadcrumb.List>
					</Breadcrumb.Root>

					<SiteHeader>Rechnung <span class="text-gray-500">#{data.invoiceNumber}</span></SiteHeader>

					<div class="grid grid-cols-2 gap-6">
						<DatePicker label="Rechnungsdatum" bind:value={invoiceDate} />
						<div class="flex flex-col gap-3">
							<Label>Fällig in</Label>
							<InputGroup.Root>
								<InputGroup.Input
									class="text-right"
									bind:value={due}
									type="number"
									min="1"
									max="600"
								></InputGroup.Input>
								<InputGroup.Addon align="inline-end">
									<InputGroup.Text>Tagen</InputGroup.Text>
								</InputGroup.Addon>
							</InputGroup.Root>
						</div>
					</div>

					<h2 class="text-xl">Artikel</h2>

					<div class="grid grid-cols-[min-content_1fr_100px] gap-4">
						<div></div>
						<p>Name</p>
						<p>Preis</p>

						{#each articles as article}
							<Button
								variant="ghost"
								onclick={() => {
									articles.splice(articles.indexOf(article), 1);
								}}
							>
								<CircleMinusIcon color="gray" />
							</Button>
							<Input type="text" bind:value={article.name} placeholder="Artikelbeschreibung" />
							<Input type="number" bind:value={article.price} />
						{/each}

						<Button
							variant="outline"
							class="col-span-3"
							onclick={() => {
								articles.push({ name: '', price: 0 });
							}}
						>
							<PlusIcon />
							Neuer Artikel
						</Button>
					</div>

					<div class="flex flex-col gap-3">
						<h2 class="text-xl">Anmerkungen</h2>
						<Textarea bind:value={notes} placeholder="Notizen zur Rechnung" />
					</div>
					<Button onclick={exporter}>
						Export
					</Button>
				</div>

				<Preview typstDocument={typstDocument()} />
			</div>
		{/if}
	{/snippet}
</Suspense>
