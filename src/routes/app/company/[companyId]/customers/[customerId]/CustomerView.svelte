<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$convex/_generated/api.js';
	import type { Doc } from '$convex/_generated/dataModel';
	import { action } from '$lib/action.svelte';
	import Address from '$lib/components/Address.svelte';
	import AddressModal from '$lib/components/AddressModal.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import * as DropDownMenu from '$lib/components/ui/dropdown-menu';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import TableBody from '$lib/components/ui/table/table-body.svelte';
	import TableCell from '$lib/components/ui/table/table-cell.svelte';
	import TableRow from '$lib/components/ui/table/table-row.svelte';
	import Table from '$lib/components/ui/table/table.svelte';
	import { daysUntilDue } from '$lib/date';
	import { isEmpty as isAddressEmpty } from '$lib/address';
	import { InvoiceStateDetail } from '$lib/invoiceState';
	import { alert } from '$lib/prompt.svelte';
	import { prompt } from '$lib/prompt.svelte.js';
	import { CheckIcon, PencilIcon } from '@lucide/svelte';
	import ArchiveIcon from '@lucide/svelte/icons/archive';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import EllipsisVerticalIcon from '@lucide/svelte/icons/ellipsis-vertical';
	import EyeIcon from '@lucide/svelte/icons/eye';
	import MailIcon from '@lucide/svelte/icons/mail';
	import PhoneIcon from '@lucide/svelte/icons/phone';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import TrashIcon from '@lucide/svelte/icons/trash';
	import { useConvexClient } from 'convex-svelte';
	import { toast } from 'svelte-sonner';

	function isCompanyEmpty(company: Doc<'companies'>) {
		return (
			company.street.trim() === '' ||
			company.zip.trim() === '' ||
			company.city.trim() === '' ||
			company.state.trim() === '' ||
			company.country.trim() === '' ||
			company.bankIban.trim() === '' ||
			company.bankBic.trim() === '' ||
			company.bankName.trim() === '' ||
			company.taxNumber.trim() === '' ||
			company.representative.trim() === ''
		);
	}

	const client = useConvexClient();

	type Props = {
		customer: Doc<'customers'>;
		invoices: Doc<'invoices'>[];
		company: Doc<'companies'>;
	};

	let { customer, invoices, company }: Props = $props();

	async function updateValue(key: string, value: string) {
		await client.mutation(api.customers.update, {
			id: customer._id,
			key,
			value,
		});
	}

	const updateContact = action(
		async ({ email, phone }: { email: string; phone: string }) => {
			await client.mutation(api.customers.updateContact, {
				id: customer._id,
				email,
				phone,
			});
		},
		'Fehler beim Aktualisieren der Kontaktdaten',
	);
	const updateNotes = action(
		async (value: string) => updateValue('notes', value),
		'Fehler beim Aktualisieren der Notizen',
	);

	let email = $state(customer.email);
	let notes = $derived(customer.notes);
	let phone = $state(customer.phone);

	$effect(() => {
		email = customer.email;
	});
	$effect(() => {
		phone = customer.phone;
	});

	let contactChanged = $derived(email !== customer.email || phone !== customer.phone);

	function copyToast(value: string, description: string) {
		navigator.clipboard.writeText(value);
		toast(`${description} kopiert`, {
			description: value,
		});
	}

	let remove = action(async () => {
		if (!(await prompt('Löschen', 'Sind Sie sicher, dass Sie diesen Kunden löschen möchten?')))
			return;
		await client.mutation(api.customers.remove, { id: customer._id });
		await goto(`/app/company/${company._id}/customers`);
		toast.success('Kunde erfolgreich gelöscht');
	}, 'Fehler beim Löschen des Kunden');

	let rename = action(async () => {
		const newName = window.prompt('Umbenennen', customer.name);
		if (newName) {
			await client.mutation(api.customers.update, {
				id: customer._id,
				key: 'name',
				value: newName,
			});
		}
	}, 'Fehler beim Umbenennen des Kunden');

	let newInvoice = action(async () => {
		if (isCompanyEmpty(company)) {
			await alert('Firma nicht komplett. Bitte setzen Sie die Adresse in den Einstellungen.');
			return;
		}

		if (isAddressEmpty(customer)) {
			await alert('Adresse nicht komplett. Bitte setzen Sie die Adresse im Kundenprofil.');
			return;
		}

		const invoiceId = await client.mutation(api.invoices.createInvoice, {
			customerId: customer._id,
		});
		await goto(`/app/company/${company._id}/customers/${customer._id}/invoices/${invoiceId}/edit`);
	}, 'Fehler beim Erstellen der Rechnung');

	let archive = action(async () => {
		if (
			invoices.some((invoice) => invoice.state != 'paid' && invoice.state != 'cancelled') &&
			!(await prompt(
				'Archivieren',
				'Kunde hat offene Rechnungen. Sind Sie sicher, dass Sie ihn archivieren möchten?',
			))
		) {
			return;
		}
		await client.mutation(api.customers.setArchived, {
			id: customer._id,
			archived: !customer.isArchived,
		});
	}, 'Fehler beim Archivieren des Kunden');
</script>

<SiteHeader>
	{customer.name}
	<div class="text-muted-foreground">#{customer.number}</div>
	<DropDownMenu.Root>
		<DropDownMenu.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="outline">
					<EllipsisVerticalIcon></EllipsisVerticalIcon>
					<div class="lg:hidden">Aktionen</div>
				</Button>
			{/snippet}
		</DropDownMenu.Trigger>
		<DropDownMenu.Content class="w-48">
			<DropDownMenu.Item onclick={rename.run}><PencilIcon />Umbenennen</DropDownMenu.Item>
			<DropDownMenu.Separator />
			<DropDownMenu.Item onclick={archive.run}><ArchiveIcon />Archivieren</DropDownMenu.Item>
			<DropDownMenu.Item onclick={remove.run}><TrashIcon />Löschen</DropDownMenu.Item>
		</DropDownMenu.Content>
	</DropDownMenu.Root>
</SiteHeader>

<div class="flex gap-2">
	<Badge variant="outline">
		Kunde #{customer.number}
	</Badge>
	{#if customer.isArchived}
		<Badge variant="outline">
			<ArchiveIcon class="size-4" />
			Archiviert
		</Badge>
	{/if}
	{#if invoices.some((invoice) => invoice.state != 'paid' && invoice.state != 'cancelled')}
		<Badge variant="outline">
			<ClockIcon class="size-4" />
			Offene Rechnungen
		</Badge>
	{/if}
</div>

<div class="flex flex-wrap gap-2">
	<Button onclick={newInvoice.run}>
		{#if newInvoice.isLoading}
			<Spinner />
		{:else}
			<PlusIcon class="size-4" />
		{/if}
		Rechnung erstellen
	</Button>
</div>

<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
	<Card>
		<CardHeader>
			<CardTitle>Kontakt</CardTitle>
		</CardHeader>

		<CardContent class="flex flex-col gap-2">
			<form
				onsubmit={(ev) => {
					ev.preventDefault();
					updateContact.run({ email, phone });
				}}
			>
				<div class="flex flex-col gap-2">
					<InputGroup.Root>
						<InputGroup.Addon align="inline-start">
							<MailIcon class="size-4" />
						</InputGroup.Addon>
						<InputGroup.Input bind:value={email} type="email" placeholder="Email" />
						{#if !contactChanged}
							<InputGroup.Addon align="inline-end">
								<InputGroup.Button onclick={() => copyToast(customer.email, 'Email')}>
									<CopyIcon class="size-4" /> Kopieren
								</InputGroup.Button>
							</InputGroup.Addon>
						{/if}
					</InputGroup.Root>
					<InputGroup.Root>
						<InputGroup.Addon align="inline-start">
							<PhoneIcon class="size-4" />
						</InputGroup.Addon>
						<InputGroup.Input bind:value={phone} type="tel" placeholder="Telefon" />
						{#if !contactChanged}
							<InputGroup.Addon align="inline-end">
								<InputGroup.Button onclick={() => copyToast(customer.phone, 'Telefon')}>
									<CopyIcon class="size-4" /> Kopieren
								</InputGroup.Button>
							</InputGroup.Addon>
						{/if}
					</InputGroup.Root>
					{#if contactChanged}
						<Button variant="default" type="submit" size="sm" class="self-end">
							{#if updateContact.isLoading}
								<Spinner />
							{:else}
								<CheckIcon class="size-4" />
							{/if}
							Speichern
						</Button>
					{/if}
				</div>
			</form>
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle>Adresse</CardTitle>
		</CardHeader>
		<CardContent>
			<Address address={customer} />
		</CardContent>
		<CardFooter>
			<AddressModal
				address={customer}
				onSave={async (address) => {
					await client.mutation(api.customers.updateAddress, {
						id: customer._id,
						...address,
					});
				}}
			/>
		</CardFooter>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle class="flex items-center gap-3">
				Notizen
				<span class="text-xs text-muted-foreground"> Nur für Sie sichtbar. </span>
			</CardTitle>
		</CardHeader>
		<CardContent>
			<form
				onsubmit={(ev) => {
					ev.preventDefault();
					updateNotes.run(notes);
				}}
			>
				<textarea
					class="field-sizing-content min-h-32 w-full border-none outline-none"
					bind:value={notes}
					placeholder="Notizen zum Kunden..."
				></textarea>
				{#if notes !== customer.notes}
					<Button variant="default" type="submit" size="sm">
						{#if updateNotes.isLoading}
							<Spinner />
						{:else}
							<CheckIcon class="size-4" />
						{/if}
						Speichern
					</Button>
				{/if}
			</form>
		</CardContent>
	</Card>
</div>

<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
	<Card>
		<CardHeader>
			<CardTitle>Rechnungen</CardTitle>
		</CardHeader>
		<CardContent>
			{#if invoices.length === 0}
				<p class="py-8 text-center text-gray-500">Keine Rechnungen vorhanden</p>
			{:else}
				<Table>
					<TableBody>
						{#each invoices as invoice}
							<a
								href="/app/company/{company._id}/customers/{customer._id}/invoices/{invoice._id}"
								class="contents"
							>
								<TableRow>
									<TableCell>
										#{invoice.number}
									</TableCell>
									<TableCell>
										Fällig in {daysUntilDue(invoice.date, invoice.dueInDays)} Tagen
									</TableCell>
									<TableCell>
										<span
											class="rounded-full px-2 py-0.5 text-xs text-white {InvoiceStateDetail[
												invoice.state
											].bgColor} text-{InvoiceStateDetail[invoice.state].textColor}"
											>{InvoiceStateDetail[invoice.state].name}</span
										>
									</TableCell>
									<TableCell>
										<DropDownMenu.Root>
											<DropDownMenu.Trigger
												class={buttonVariants({ variant: 'ghost', size: 'icon' })}
											>
												<EllipsisVerticalIcon class="size-4" />
											</DropDownMenu.Trigger>

											<DropDownMenu.Content>
												<DropDownMenu.Item
													onSelect={() =>
														goto(
															`/app/company/${company._id}/customers/${customer._id}/invoices/${invoice._id}/edit`,
														)}
												>
													Bearbeiten
												</DropDownMenu.Item>
												<DropDownMenu.Separator />
												{@const deleteInvoice = action(async () => {
													if (
														!(await prompt(
															'Löschen',
															'Sind Sie sicher, dass Sie diese Rechnung löschen möchten?',
														))
													)
														return;
													const invoiceNumber = invoice.number;
													await client.mutation(api.invoices.deleteInvoice, {
														id: invoice._id,
													});
													toast.success(`Rechnung #${invoiceNumber} gelöscht`);
												}, 'Fehler beim Löschen der Rechnung')}
												<DropDownMenu.Item onclick={deleteInvoice.run}>
													<TrashIcon class="size-4" />
													Löschen
												</DropDownMenu.Item>
											</DropDownMenu.Content>
										</DropDownMenu.Root>
									</TableCell>
								</TableRow>
							</a>
						{/each}
					</TableBody>
				</Table>
			{/if}
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle>Zeiterfassung</CardTitle>
		</CardHeader>
		<CardContent>
			
		</CardContent>
	</Card>
</div>
