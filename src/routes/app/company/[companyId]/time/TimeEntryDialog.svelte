<script lang="ts">
	import { api } from '$convex/_generated/api';
	import type { Doc, Id } from '$convex/_generated/dataModel';
	import { action } from '$lib/action.svelte';
	import DateTimePicker from '$lib/components/DateTimePicker.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Spinner } from '$lib/components/ui/spinner';
	import { formatDateTime, parseDateTime, nowDateTime } from '$lib/date';
	import { type CalendarDateTime } from '@internationalized/date';
	import { useConvexClient } from 'convex-svelte';

	let {
		customers,
		invoices,
		companyId,
	}: {
		customers: Doc<'customers'>[];
		invoices: (Doc<'invoices'> & { customer: Doc<'customers'> | null })[];
		companyId: Id<'companies'>;
	} = $props();

	const client = useConvexClient();

	let open = $state(false);
	let mode = $state<'create' | 'edit'>('create');
	let editingEntry = $state<Doc<'timeEntries'> | undefined>(undefined);

	let description = $state('');
	let customerId = $state<Id<'customers'> | undefined>(undefined);
	let invoiceId = $state<Id<'invoices'> | undefined>(undefined);
	let startDateTime = $state<CalendarDateTime | undefined>(nowDateTime());
	let endDateTime = $state<CalendarDateTime | undefined>(nowDateTime());

	const createAction = action(async () => {
		if (!startDateTime || !endDateTime) return;

		await client.mutation(api.timeEntries.create, {
			companyId,
			description,
			customerId: customerId || undefined,
			invoiceId: invoiceId || undefined,
			startDateTime: formatDateTime(startDateTime),
			endDateTime: formatDateTime(endDateTime),
		});
		open = false;
	}, 'Fehler beim Erstellen des Zeiteintrags');

	const updateAction = action(async () => {
		if (!editingEntry || !startDateTime || !endDateTime) return;

		await client.mutation(api.timeEntries.update, {
			id: editingEntry._id,
			description,
			customerId: customerId || undefined,
			invoiceId: invoiceId || undefined,
			startDateTime: formatDateTime(startDateTime),
			endDateTime: formatDateTime(endDateTime),
		});
		open = false;
	}, 'Fehler beim Aktualisieren des Zeiteintrags');

	function resetForm() {
		description = '';
		customerId = undefined;
		invoiceId = undefined;
		startDateTime = nowDateTime();
		endDateTime = nowDateTime();
		editingEntry = undefined;
		mode = 'create';
	}

	export function create() {
		resetForm();
		mode = 'create';
		open = true;
	}

	export function edit(entry: Doc<'timeEntries'>) {
		editingEntry = entry;
		description = entry.description;
		customerId = entry.customerId;
		invoiceId = entry.invoiceId;
		startDateTime = parseDateTime(entry.startDateTime);
		endDateTime = parseDateTime(entry.endDateTime!);
		mode = 'edit';
		open = true;
	}

	$effect(() => {
		if (!open) {
			resetForm();
		}
	});

	let filteredInvoices = $derived(
		customerId ? invoices.filter((inv) => inv.customerId === customerId) : invoices
	);

	const isLoading = $derived(createAction.isLoading || updateAction.isLoading);
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title>
				{mode === 'create' ? 'Neuer Zeiteintrag' : 'Zeiteintrag bearbeiten'}
			</Dialog.Title>
			<Dialog.Description>
				{mode === 'create'
					? 'Erstellen Sie einen neuen Zeiteintrag.'
					: 'Bearbeiten Sie den Zeiteintrag.'}
			</Dialog.Description>
		</Dialog.Header>

		<div class="grid gap-4 py-4">
			<div class="flex flex-col gap-2">
				<Label for="description">Beschreibung</Label>
				<Input
					id="description"
					type="text"
					placeholder="Beschreibung eingeben..."
					bind:value={description}
				/>
			</div>

			<div class="flex flex-col gap-2">
				<Label>Kunde</Label>
				<Select.Root type="single" bind:value={customerId}>
					<Select.Trigger class="w-full">
						{customerId
							? customers.find((c) => c._id === customerId)?.name
							: 'Kein Kunde ausgewählt'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">Kein Kunde</Select.Item>
						<Select.Separator />
						{#each customers as customer}
							<Select.Item value={customer._id}>{customer.name}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			{#if mode === 'edit'}
				<div class="flex flex-col gap-2">
					<Label>Rechnung</Label>
					<Select.Root type="single" bind:value={invoiceId}>
						<Select.Trigger class="w-full">
							{invoiceId
								? `#${invoices.find((i) => i._id === invoiceId)?.number}`
								: 'Keine Rechnung ausgewählt'}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="">Keine Rechnung</Select.Item>
							<Select.Separator />
							{#each filteredInvoices as invoice}
								<Select.Item value={invoice._id}>
									#{invoice.number} - {invoice.customer?.name ?? 'Unbekannt'}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			{/if}

			<div class="grid grid-cols-2 gap-4">
				<DateTimePicker label="Start" bind:value={startDateTime} />
				<DateTimePicker label="Ende" bind:value={endDateTime} />
			</div>
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (open = false)}>Abbrechen</Button>
			<Button
				onclick={() => (mode === 'create' ? createAction.run(undefined) : updateAction.run(undefined))}
				disabled={!description || !startDateTime || !endDateTime || isLoading}
			>
				{#if isLoading}
					<Spinner class="size-4" />
				{/if}
				{mode === 'create' ? 'Erstellen' : 'Speichern'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
