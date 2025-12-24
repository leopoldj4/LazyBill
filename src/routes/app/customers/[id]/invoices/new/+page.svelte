<script lang="ts">
	import SiteHeader from '$lib/components/site-header.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import { today, type CalendarDate } from '@internationalized/date';
	import { getLocalTimeZone } from '@internationalized/date';
	import Button from '$lib/components/ui/button/button.svelte';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import Input from '$lib/components/ui/input/input.svelte';
	import CircleMinusIcon from '@lucide/svelte/icons/circle-minus';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Preview from '$lib/Preview.svelte';
	import { invoice } from '$lib/invoice';
    import * as InputGroup from "$lib/components/ui/input-group";
	import Label from '$lib/components/ui/label/label.svelte';


	let { data } = $props();

	let invoiceDate = $state<CalendarDate>(today(getLocalTimeZone()));
	let invoiceDueDate = $state<CalendarDate>(today(getLocalTimeZone()).add({ days: 30 }));

    let due = $state<number | null>(30);

	let articles = $state<Article[]>([{ name: '', price: 0 }]);

	type Article = {
		name: string;
		price: number;
	};

	let typstDocument = $derived(() => invoice(data.company!, data.customer!, articles, invoiceDate, "###", due || 0));
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

		<div class="grid grid-cols-2 gap-6">
			<DatePicker label="Rechnungsdatum" bind:value={invoiceDate} />
            <div class="flex flex-col gap-3">
            <Label>Fällig in</Label>
            <InputGroup.Root>
                <InputGroup.Input class="text-right" bind:value={due} type="number" min="1" max="600"></InputGroup.Input>
                <InputGroup.Addon align="inline-end">
                    <InputGroup.Text>
                    Tagen
                    </InputGroup.Text>
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
	</div>


    <Preview typstDocument={typstDocument()} />

</div>
