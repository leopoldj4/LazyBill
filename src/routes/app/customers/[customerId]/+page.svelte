<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$convex/_generated/api.js';
	import type { Id } from '$convex/_generated/dataModel.js';
	import { debounce } from '$lib';
	import SiteHeader from '$lib/components/site-header.svelte';
	import Suspense from '$lib/components/Suspense.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import TableBody from '$lib/components/ui/table/table-body.svelte';
	import TableRow from '$lib/components/ui/table/table-row.svelte';
	import TableCell from '$lib/components/ui/table/table-cell.svelte';
	import Table from '$lib/components/ui/table/table.svelte';
	import { InvoiceStateDetail } from '$lib/invoiceStatus';
	import ArchiveIcon from '@lucide/svelte/icons/archive';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import EditIcon from '@lucide/svelte/icons/edit';
	import MailIcon from '@lucide/svelte/icons/mail';
	import PhoneIcon from '@lucide/svelte/icons/phone';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import TrashIcon from '@lucide/svelte/icons/trash';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { toast } from 'svelte-sonner';
	import { daysUntilDue } from '$lib/date';
	import { action } from '$lib/action.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { ClockIcon } from '@lucide/svelte';
	import Address from '$lib/components/AddressModal.svelte';
	import { ask } from '$lib/ask.svelte.js';

	const client = useConvexClient();

	let { data } = $props();

	const query = useQuery(api.customers.getFull, () => ({
		id: data.customerId as Id<'customers'>,
	}));

	async function updateValue(key: string, event: Event) {
		await client.mutation(api.customers.update, {
			id: data.customerId as Id<'customers'>,
			key: key,
			value: (event.target as HTMLInputElement).value,
		});
	}

	let updateNotes = debounce((event: Event) => updateValue('notes', event));
	let updateEmail = debounce((event: Event) => updateValue('email', event));
	let updatePhone = debounce((event: Event) => updateValue('phone', event));

	function copyToast(value: string, description: string) {
		navigator.clipboard.writeText(value);
		toast(`${description} kopiert`, {
			description: value,
		});
	}

	let remove = action(async () => {
		if (!(await ask('Löschen', 'Sind Sie sicher, dass Sie diesen Kunden löschen möchten?'))) return;
		await client.mutation(api.customers.remove, { id: data.customerId as Id<'customers'> });
		await goto('/app/customers');
		toast.success('Kunde erfolgreich gelöscht');
	}, 'Fehler beim Löschen des Kunden');

	let newInvoice = action(async () => {
		const invoiceId = await client.mutation(api.invoices.createInvoice, {
			customerId: data.customerId as Id<'customers'>,
		});
		await goto(`/app/customers/${data.customerId}/invoices/${invoiceId}`);
	}, 'Fehler beim Erstellen der Rechnung');

	let archive = action(async () => {
		if (!query.data?.customer) return;
		if (
			!query.data.customer.isArchived &&
			query.data.invoices.some(
				(invoice) => invoice.state != 'paid' && invoice.state != 'cancelled',
			) &&
			!(await ask('Archivieren', 'Kunde hat offene Rechnungen. Sind Sie sicher, dass Sie ihn archivieren möchten?'))
		) {
			return;
		}
		await client.mutation(api.customers.setArchived, {
			id: data.customerId as Id<'customers'>,
			archived: !query.data.customer.isArchived,
		});
	}, 'Fehler beim Archivieren des Kunden');
</script>

<Suspense {query} class="h-[60vh]">
	{#snippet children(data)}
		{#if !data}
			<div class="flex items-center justify-center">
				<p>Kunde nicht gefunden</p>
			</div>
		{:else}
			{@const { customer, invoices } = data}
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/app/customers">Kunden</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>{customer.name}</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>

			<SiteHeader>
				{customer.name}
				<div class="text-gray-500">#{customer.number}</div>
			</SiteHeader>

			<div class="flex gap-2">
				{#if customer.isArchived}
					<Badge variant="outline">
						<ArchiveIcon class="h-4 w-4" />
						Archiviert
					</Badge>
				{/if}
				{#if data.invoices.some((invoice) => invoice.state != 'paid' && invoice.state != 'cancelled')}
					<Badge variant="outline">
						<ClockIcon class="h-4 w-4" />
						Offene Rechnungen
					</Badge>
				{/if}
			</div>

			<ButtonGroup.Root class="flex-wrap">
				<ButtonGroup.Root>
					<Button variant="outline" onclick={newInvoice.run}>
						{#if newInvoice.isLoading}
							<Spinner />
						{:else}
							<PlusIcon class="h-4 w-4" />
						{/if}
						Rechnung erstellen
					</Button>
				</ButtonGroup.Root>
				<ButtonGroup.Root>
					<Button variant="outline" onclick={archive.run}>
						{#if archive.isLoading}
							<Spinner />
						{:else}
							<ArchiveIcon class="h-4 w-4" />
						{/if}
						{#if customer.isArchived}
							Archiv entfernen
						{:else}
							Archivieren
						{/if}
					</Button>
					<Button variant="outline" onclick={remove.run}>
						{#if remove.isLoading}
							<Spinner />
						{:else}
							<TrashIcon class="h-4 w-4 text-destructive" />
						{/if}
						Löschen
					</Button>
				</ButtonGroup.Root>
			</ButtonGroup.Root>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>Kontakt</CardTitle>
					</CardHeader>

					<CardContent class="flex flex-col gap-2">
						<InputGroup.Root>
							<InputGroup.Addon align="inline-start">
								<MailIcon class="h-4 w-4" />
							</InputGroup.Addon>
							<InputGroup.Input
								value={customer.email}
								type="email"
								placeholder="Email"
								oninput={updateEmail}
								onkeydown={updateEmail}
							/>
							<InputGroup.Addon align="inline-end">
								<InputGroup.Button onclick={() => copyToast(customer.email, 'Email')}>
									<CopyIcon class="h-4 w-4" /> Kopieren
								</InputGroup.Button>
							</InputGroup.Addon>
						</InputGroup.Root>
						<InputGroup.Root>
							<InputGroup.Addon align="inline-start">
								<PhoneIcon class="h-4 w-4" />
							</InputGroup.Addon>
							<InputGroup.Input
								value={customer.phone}
								type="tel"
								placeholder="Telefon"
								oninput={updatePhone}
								onkeydown={updatePhone}
							/>
							<InputGroup.Addon align="inline-end">
								<InputGroup.Button onclick={() => copyToast(customer.phone, `Telefon`)}>
									<CopyIcon class="h-4 w-4" /> Kopieren
								</InputGroup.Button>
							</InputGroup.Addon>
						</InputGroup.Root>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Adresse</CardTitle>
					</CardHeader>
					<CardContent>
						{customer.invoiceStreet}<br />
						{customer.invoiceZip}
						{customer.invoiceCity}<br />
						{customer.invoiceState}{#if customer.invoiceState && customer.invoiceCountry}
							{", "}
						{/if}{customer.invoiceCountry}
					</CardContent>
					<CardFooter>
						<Address customer={data.customer} />
					</CardFooter>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle class="flex items-center gap-3">
							Notizen
							<span class="text-xs text-gray-500"> Nur für Sie sichtbar. </span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<textarea
							class="field-sizing-content min-h-32 w-full border-none outline-none"
							value={customer.notes}
							onchange={updateNotes}
							onkeydown={updateNotes}
							placeholder="Notizen zum Kunden..."
						></textarea>
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
											href="/app/customers/{data.customer._id}/invoices/{invoice._id}"
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
											</TableRow></a
										>
									{/each}
								</TableBody>
							</Table>
						{/if}
					</CardContent>
				</Card>
			</div>
		{/if}
	{/snippet}
</Suspense>
