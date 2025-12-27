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
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { api } from '$convex/_generated/api.js';
	import type { Id } from '$convex/_generated/dataModel.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import Suspense from '$lib/components/Suspense.svelte';
	import { parseDate } from '$lib/date';
	import { exportPDF } from '$lib/typst/export';
	import * as Select from '$lib/components/ui/select';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import MailIcon from '@lucide/svelte/icons/mail';
	import CheckIcon from '@lucide/svelte/icons/check';
	import TrashIcon from '@lucide/svelte/icons/trash';
	import FileDownIcon from '@lucide/svelte/icons/file-down';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { ButtonGroup } from '$lib/components/ui/button-group';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { action } from '$lib/action.svelte';
	import { Spinner } from '$lib/components/ui/spinner';

	const client = useConvexClient();

	let { data } = $props();

	const query = useQuery(api.invoices.getFull, () => ({
		id: data.invoiceId as Id<'invoices'>,
	}));

	$effect(() => {
		if (query.data && query.data.customer._id !== data.customerId) {
			goto(`/app/customers/${query.data.customer._id}/invoices/${data.invoiceId}`);
		}
	});

	let due = $state<number | null>(30);
	let articles = $state<Article[]>([{ name: '', price: 0 }]);
	let notes = $state<string>('');

	type Article = {
		name: string;
		price: number;
	};

	let invoiceDate = $derived(query.data ? parseDate(query.data.invoice.date) : undefined);

	let invoiceState = $state<'draft' | 'sent' | 'paid' | 'cancelled'>('draft');

	const invoiceStates = {
		draft: 'Entwurf',
		sent: 'Gesendet',
		paid: 'Bezahlt',
		cancelled: 'Storniert',
	};

	const invoiceStateIcons = {
		draft: PencilIcon,
		sent: MailIcon,
		paid: CheckIcon,
		cancelled: TrashIcon,
	};

	const invoiceStateColors = {
		draft: 'text-yellow-500',
		sent: 'text-blue-500',
		paid: 'text-green-500',
		cancelled: 'text-gray-500',
	};

	let editing = $state(false);

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

	let deleteInvoice = action(async () => {
		if (!confirm('Sind Sie sicher, dass Sie diese Rechnung löschen möchten?')) return;
		const invoiceNumber = query.data!.invoiceNumber;
		await client.mutation(api.invoices.deleteInvoice, {
			id: data.invoiceId as Id<'invoices'>,
		});
		toast.success(`Rechnung #${invoiceNumber} gelöscht`);
		await goto(`/app/customers/${data.customerId}`);
	}, 'Fehler beim Löschen der Rechnung');
</script>

<Suspense {query} class="h-[60vh]">
	{#snippet children(data)}
		{#if !data}
			<div class="flex h-full items-center justify-center">
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

					{#if editing}
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

						<Button class="block items-start" onclick={() => (editing = false)}>Weiter</Button>
					{:else}
						<ButtonGroup>
							<ButtonGroup>
								<Select.Root type="single" bind:value={invoiceState}>
									<Select.Trigger>
										<span class="mr-2 font-bold">Status:</span>
										{@const Icon = invoiceStateIcons[invoiceState]}
										<Icon class="size-4 {invoiceStateColors[invoiceState]}" />
										{invoiceStates[invoiceState]}
									</Select.Trigger>
									<Select.Content>
										{#each Object.keys(invoiceStates) as state}
											<Select.Item value={state}>
												{@const Icon = invoiceStateIcons[state as keyof typeof invoiceStateIcons]}
												<Icon
													class="size-4 {invoiceStateColors[
														state as keyof typeof invoiceStateColors
													]}"
												/>
												{invoiceStates[state as keyof typeof invoiceStates]}
											</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
								{#if invoiceState === 'draft'}
									<Button
										variant="outline"
										class="text-gray-600"
										onclick={() => (invoiceState = 'sent')}
									>
										<ArrowRightIcon /> Gesendet
									</Button>
								{/if}
								{#if invoiceState === 'sent'}
									<Button
										variant="outline"
										class="text-gray-600"
										onclick={() => (invoiceState = 'paid')}
									>
										<ArrowRightIcon /> Bezahlt
									</Button>
								{/if}
							</ButtonGroup>
							<ButtonGroup>
								<Button variant="outline" onclick={deleteInvoice.run}>
									{#if deleteInvoice.isLoading}
										<Spinner />
									{:else}
										<TrashIcon class="size-4 text-destructive" />
									{/if}
									Löschen
								</Button>
							</ButtonGroup>
						</ButtonGroup>

						<h2 class="text-xl">Zusammenfassung</h2>
						<p>Gesamtbetrag: {articles.reduce((acc, article) => acc + article.price, 0)} €</p>

						<div class="flex flex-row gap-2">
							<Button variant="outline" onclick={() => (editing = true)}>
								<PencilIcon class="size-4" /> Bearbeiten</Button
							>
							<Button onclick={exporter}><FileDownIcon class="size-4" /> Exportieren</Button>
						</div>
					{/if}
				</div>

				<Preview typstDocument={typstDocument()} />
			</div>
		{/if}
	{/snippet}
</Suspense>
