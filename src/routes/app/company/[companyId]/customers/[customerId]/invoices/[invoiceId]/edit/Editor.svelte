<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$convex/_generated/api';
	import type { Doc, Id } from '$convex/_generated/dataModel';
	import { action } from '$lib/action.svelte';
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
	import { calculateDurationInHours, formatDate, parseDate } from '$lib/date';
	import { sleep } from '$lib';
	import { createPDF } from '$lib/typst/export';
	import { invoiceTemplate } from '$lib/typst/invoice';
	import CircleMinusIcon from '@lucide/svelte/icons/circle-minus';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { useConvexClient } from 'convex-svelte';
	import { toast } from 'svelte-sonner';
	import { Spinner } from '$lib/components/ui/spinner';
	import Path from '$lib/components/Path.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Card from '$lib/components/ui/card';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { CheckIcon, Divide } from '@lucide/svelte';
	import { formatDateTimeRange, calculateDuration } from '$lib/date';

	const client = useConvexClient();
	let {
		customer,
		invoice,
		company,
		timeEntries,
	}: {
		customer: Doc<'customers'>;
		invoice: Doc<'invoices'>;
		company: Doc<'companies'>;
		timeEntries: Doc<'timeEntries'>[];
	} = $props();

	let due = $state<number | null>(invoice.dueInDays);
	let articles = $state(invoice.articles);
	let notes = $state(invoice.notes);
	let timeExpanded = $state(false);
	let selectedTimeEntries = $state<Id<'timeEntries'>[]>([]);
	let hourlyRate = $state('100');
	let smallestUnit = $state(1);

	function selectTimeEntry(timeEntryId: Id<'timeEntries'>) {
		if (selectedTimeEntries.includes(timeEntryId)) {
			selectedTimeEntries.splice(selectedTimeEntries.indexOf(timeEntryId), 1);
		} else {
			selectedTimeEntries.push(timeEntryId);
		}
	}

	let invoiceDate = $state(parseDate(invoice.date));

	let typstDocument = $derived(() => {
		const timeEntryArticles = timeEntries
			.filter((entry) => selectedTimeEntries.includes(entry._id))
			.map((entry) => ({
				name: `${entry.description} (${calculateDuration(entry.startDateTime, entry.endDateTime!)})`,
				price:
					Math.round(
						calculateDurationInHours(entry.startDateTime, entry.endDateTime!, smallestUnit) *
							parseFloat(hourlyRate) *
							100,
					) / 100,
			}));

		return invoiceTemplate(
			company,
			customer,
			[...timeEntryArticles, ...articles],
			invoiceDate,
			invoice.number,
			due || 0,
			notes,
		);
	});

	const done = action(async () => {
		const uploadUrl = await client.mutation(api.invoices.generateUploadUrl, {});

		const document = await createPDF(typstDocument());
		const { storageId } = await fetch(uploadUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/pdf' },
			body: new Blob([document.slice()], { type: 'application/pdf' }),
		}).then((res) => res.json());

		await client.mutation(api.invoices.updateInvoice, {
			id: invoice._id,
			articles,
			notes,
			dueInDays: due || 0,
			date: formatDate(invoiceDate),
			file: storageId as Id<'_storage'>,
		});

		toast.success('Rechnung erfolgreich gespeichert');

		await sleep(500);

		await goto(`/app/company/${company._id}/customers/${customer._id}/invoices/${invoice._id}`);
	}, 'Fehler beim Finalisieren der Rechnung');
</script>

<Path
	label="Rechnung #{invoice.number}"
	href="/app/company/{company._id}/customers/{customer._id}/invoices/{invoice._id}"
/>

<div class="grid gap-12 lg:grid-cols-2">
	<div class="flex flex-col gap-8">
		<SiteHeader>Rechnung <span class="text-muted-foreground">#{invoice.number}</span></SiteHeader>

		<div class="grid gap-6 lg:grid-cols-2">
			<DatePicker label="Rechnungsdatum" bind:value={invoiceDate} />
			<div class="flex flex-col gap-3">
				<Label>Fällig in</Label>
				<InputGroup.Root>
					<InputGroup.Input
						required
						aria-invalid={due == null || due < 0}
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

		<div class="grid gap-4 border-y py-6">
			<div class="flex flex-row items-center justify-between gap-2">
				<Card.Title>Bisher nicht abgerechnete Zeit</Card.Title>
				<Button variant="ghost" size="icon" onclick={() => (timeExpanded = !timeExpanded)}>
					<ChevronDownIcon
						class="transition-transform {timeExpanded ? 'rotate-180' : ''} duration-200"
					/>
				</Button>
			</div>

			<!-- todo: ohnekunden vs mit kunde -->
			{#if timeExpanded}
				<div class="flex flex-col divide-y rounded-lg border">
					{#each timeEntries.filter((timeEntry) => timeEntry.customerId === customer._id) as timeEntry (timeEntry._id)}
						<div class="flex flex-row items-center gap-6 px-4 py-2">
							<Button
								variant={selectedTimeEntries.includes(timeEntry._id) ? 'default' : 'secondary'}
								size="icon"
								onclick={() => selectTimeEntry(timeEntry._id)}
							>
								{#if selectedTimeEntries.includes(timeEntry._id)}
									<CheckIcon />
								{:else}
									<PlusIcon />
								{/if}
							</Button>
							<div class="grid">
								<div class="text-lg">{timeEntry.description}</div>
								<span>
									{formatDateTimeRange(timeEntry.startDateTime, timeEntry.endDateTime!)}
									&middot;
									{calculateDuration(timeEntry.startDateTime, timeEntry.endDateTime!)}
								</span>
							</div>
							<div class="ml-auto flex flex-row gap-2">
								{Math.round(
									calculateDurationInHours(
										timeEntry.startDateTime,
										timeEntry.endDateTime!,
										smallestUnit,
									) *
										parseFloat(hourlyRate) *
										100,
								) / 100} €
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<div class="grid gap-4 lg:grid-cols-2">
			<InputGroup.Root>
				<InputGroup.Addon>Stundensatz</InputGroup.Addon>
				<InputGroup.Input type="number" bind:value={hourlyRate} class="text-right" placeholder="" />
				<InputGroup.Addon align="inline-end">
					<InputGroup.Text>€</InputGroup.Text>
				</InputGroup.Addon>
			</InputGroup.Root>

			<InputGroup.Root>
				<InputGroup.Addon>Kleinste Zeiteinheit</InputGroup.Addon>
				<InputGroup.Input
					type="number"
					bind:value={smallestUnit}
					class="text-right"
					placeholder=""
				/>
				<InputGroup.Addon align="inline-end">
					<InputGroup.Text>min</InputGroup.Text>
				</InputGroup.Addon>
			</InputGroup.Root>
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
						<CircleMinusIcon class="text-muted-foreground" />
					</Button>
					<Input
						type="text"
						bind:value={article.name}
						placeholder="Artikelbeschreibung"
						class="max-lg:hidden"
						required
						aria-invalid={article.name == '' || article.name == null}
					/>
					<InputGroup.Root>
						<InputGroup.Input
							type="number"
							bind:value={article.price}
							min="0"
							aria-invalid={article.price <= 0 || article.price == null}
						/>
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

			<div>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button variant="outline" size="sm" {...props}>
								<PlusIcon />
								Hinzufügen
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>

					<DropdownMenu.Content class="w-48" align="start">
						<DropdownMenu.Item
							onclick={() => {
								articles.push({ name: '', price: 0 });
							}}>Neuer Artikel</DropdownMenu.Item
						>
						<DropdownMenu.Separator />
						{#each timeEntries as timeEntry}
							<DropdownMenu.Item
								onclick={() => {
									articles.push({ name: timeEntry.description, price: 0 });
								}}
							>
								{timeEntry.description}
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>

		<div class="flex flex-col gap-3">
			<h2 class="text-xl">Anmerkungen</h2>
			<Textarea bind:value={notes} placeholder="Notizen zur Rechnung" />
		</div>

		<div class="flex flex-row gap-2">
			<Button variant="default" onclick={done.run} disabled={done.isLoading}>
				{#if done.isLoading}
					<Spinner class="size-4" />
				{/if}

				Fertig
			</Button>
		</div>
	</div>

	<Preview typstDocument={typstDocument()} />
</div>
