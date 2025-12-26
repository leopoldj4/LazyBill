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
	import ArchiveIcon from '@lucide/svelte/icons/archive';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import EditIcon from '@lucide/svelte/icons/edit';
	import MailIcon from '@lucide/svelte/icons/mail';
	import PhoneIcon from '@lucide/svelte/icons/phone';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import TrashIcon from '@lucide/svelte/icons/trash';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { toast } from 'svelte-sonner';

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

	async function remove() {
		if (!confirm('Are you sure you want to remove this customer?')) return;
		await client.mutation(api.customers.remove, { id: data.customerId as Id<'customers'> });
		await goto('/app/customers');
	}

	let isCreatingInvoice = $state(false);
	async function newInvoice() {
		isCreatingInvoice = true;
		try {
			const invoiceId = await client.mutation(api.invoices.createInvoice, {
				customerId: data.customerId as Id<'customers'>,
			});
			await goto(`/app/customers/${data.customerId}/invoices/${invoiceId}`);
		} finally {
			isCreatingInvoice = false;
		}
	}
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

			<ButtonGroup.Root>
				<ButtonGroup.Root>
					<Button variant="outline" onclick={newInvoice}>
						{#if isCreatingInvoice}
							<Spinner />
						{:else}
							<PlusIcon class="h-4 w-4" />
						{/if}
						Rechnung erstellen
					</Button>
				</ButtonGroup.Root>
				<ButtonGroup.Root>
					<Button variant="outline">
						<ArchiveIcon class="h-4 w-4" />
						Archivieren
					</Button>
					<Button variant="outline" onclick={remove}>
						<TrashIcon class="h-4 w-4 text-destructive" />
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
							-
						{/if}{customer.invoiceCountry}
					</CardContent>
					<CardFooter>
						<ButtonGroup.Root>
							<Button variant="outline">
								<EditIcon class="h-4 w-4" />
								Adresse bearbeiten
							</Button>
						</ButtonGroup.Root>
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
		{/if}
	{/snippet}
</Suspense>
