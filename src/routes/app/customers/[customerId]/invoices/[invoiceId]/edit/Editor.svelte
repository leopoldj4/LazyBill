<script lang="ts">
	import type { Doc } from '$convex/_generated/dataModel';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import Preview from '$lib/components/Preview.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as InputGroup from '$lib/components/ui/input-group';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { parseDate } from '$lib/date';
	import { invoiceTemplate } from '$lib/typst/invoice';
	import CircleMinusIcon from '@lucide/svelte/icons/circle-minus';
	import PlusIcon from '@lucide/svelte/icons/plus';

	let {
		customer,
		invoice,
		company,
	}: {
		customer: Doc<'customers'>;
		invoice: Doc<'invoices'>;
		company: Doc<'companies'>;
	} = $props();

	let due = $state<number | null>(30);
	let articles = $state([{ name: '', price: 0 }]);
	let notes = $state<string>('');

	let invoiceDate = $derived(parseDate(invoice.date));
    

	let typstDocument = $derived(() => invoiceTemplate(company, customer, articles, invoiceDate, invoice.number, due || 0, notes));
</script>

<div class="grid gap-12 lg:grid-cols-2">
	<div class="flex flex-col gap-8">
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/app/customers">Kunden</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/app/customers/{customer._id}">{customer.name}</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>Rechnung #{invoice.number}</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>

		<SiteHeader>Rechnung <span class="text-gray-500">#{invoice.number}</span></SiteHeader>

		<div class="grid gap-6 lg:grid-cols-2">
			<DatePicker label="Rechnungsdatum" bind:value={invoiceDate} />
			<div class="flex flex-col gap-3">
				<Label>Fällig in</Label>
				<InputGroup.Root>
					<InputGroup.Input class="text-right" bind:value={due} type="number" min="1" max="600"
					></InputGroup.Input>
					<InputGroup.Addon align="inline-end">
						<InputGroup.Text>Tagen</InputGroup.Text>
					</InputGroup.Addon>
				</InputGroup.Root>
			</div>
		</div>

		<h2 class="text-xl">Artikel</h2>

		<div class="flex flex-col gap-4">
			{#each articles as article}
				<div class="grid grid-cols-[min-content_1fr] gap-4 lg:grid-cols-[min-content_1fr_100px]">
					<Button
						variant="ghost"
                        disabled={articles.length === 1}
						onclick={() => {
							articles.splice(articles.indexOf(article), 1);
						}}
					>
						<CircleMinusIcon color="gray" />
					</Button>
					<Input
						type="text"
						bind:value={article.name}
						placeholder="Artikelbeschreibung"
						class="max-lg:hidden"
					/>
					<InputGroup.Root>
						<InputGroup.Input type="number" bind:value={article.price} />
						<InputGroup.Addon align="inline-end">
							<InputGroup.Text>€</InputGroup.Text>
						</InputGroup.Addon>
					</InputGroup.Root>
					<Input
						type="text"
						bind:value={article.name}
						placeholder="Artikelbeschreibung"
						class="col-span-2 lg:hidden"
					/>
				</div>
				<Separator orientation="horizontal" class="col-span-2 lg:col-span-3" />
			{/each}

			<Button
				variant="outline"
				class="col-span-2 lg:col-span-3"
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
	</div>

	<Preview typstDocument={typstDocument()} />
</div>
