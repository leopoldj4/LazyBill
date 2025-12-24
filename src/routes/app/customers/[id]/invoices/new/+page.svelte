<script lang="ts">
	import SiteHeader from '$lib/components/site-header.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import { today, type CalendarDate } from '@internationalized/date';
	import { getLocalTimeZone } from '@internationalized/date';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import Input from '$lib/components/ui/input/input.svelte';
	import CircleMinusIcon from '@lucide/svelte/icons/circle-minus';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Preview from '$lib/Preview.svelte';
	import { invoiceTemplate } from '$lib/invoicetemplate';

	let { data } = $props();

	let invoiceDate = $state<CalendarDate>(today(getLocalTimeZone()));
	let invoiceDueDate = $state<CalendarDate>(today(getLocalTimeZone()).add({ days: 30 }));

	let notes = $state<string>('');

	let articles = $state<Article[]>([{ name: '', price: 0 }]);

	type Article = {
		name: string;
		price: number;
	};

	let typstDocument = $derived(() => {
		let doc = `
#import "@preview/invoice-pro:0.1.0": *

// Set language to German for correct date/number formatting
#set text(lang: "de") 

#show: invoice.with(
  format: "DIN-5008-A", // or "DIN-5008-B"
  
  sender: (
    name: "${data.company!.name}",
    address: "${data.company!.street} ${data.company!.streetExtra}",
    city: "${data.company!.city}",
    extra: (
      "Tel": [${data.company!.phone}],
    )
  ),

  recipient: (
    name: "${data.customer!.name}",
    address: "${data.customer!.invoiceStreet} ${data.customer!.invoiceStreetExtra}",
    city: "${data.customer!.invoiceCity}, ${data.customer!.invoiceState}, ${data.customer!.invoiceZip}, ${data.customer!.invoiceCountry}"
  ),

  invoice-nr: "###",
  date: datetime(year: ${invoiceDate.year}, month: ${invoiceDate.month}, day: ${invoiceDate.day}),
  tax-nr: "${data.company!.taxNumber}",
  vat-exempt-small-biz: ${data.company!.smallBusiness ? 'true' : 'false'},
  font: "Arial",
)

// Add Invoice Items
#invoice-line-items(
  ${articles.map((article) => `item([${article.name}], price: ${article.price || 0}),`).join('\n')}
)

// Payment Terms
#payment-goal(days: 30)

// Bank Details with QR Code
#bank-details(
  bank: "${data.company!.bankName}",
  iban: "${data.company!.bankIban}",
  bic: "${data.company!.bankBic}",
)

#signature(signature: block[${data.company!.representative || data.company!.name}])
    `;
		return doc;
	});
</script>

<div class="grid grid-cols-2 gap-12">
	<div class="flex flex-col gap-8">
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/app/customers">Kunden</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/app/customers/{data.customer!.id}"
						>{data.customer!.name}</Breadcrumb.Link
					>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>Neue Rechnung</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>

		<SiteHeader>Neue Rechnung</SiteHeader>

		<div class="flex w-full flex-col items-stretch gap-6">
			<DatePicker label="Rechnungsdatum" value={invoiceDate} />
			<!-- <DatePicker label="Fälligkeitsdatum" value={invoiceDueDate} /> -->
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
				<Input type="text" bind:value={article.name} />
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
				Add Article
			</Button>
		</div>

		<div class="flex flex-col gap-4">
			<h2 class="text-xl">Notizen</h2>
			<Textarea bind:value={notes} />
		</div>
	</div>


    <Preview typstDocument={typstDocument()} />

</div>
