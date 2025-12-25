<script lang="ts">
	import SiteHeader from '$lib/components/site-header.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Textarea } from '$lib/components/ui/textarea';
	import EditIcon from '@lucide/svelte/icons/edit';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import MailIcon from '@lucide/svelte/icons/mail';
	import PhoneIcon from '@lucide/svelte/icons/phone';
	import { useQuery } from 'convex-svelte';
	import { api } from '../../../../convex/_generated/api.js';
	import type { Id } from '../../../../convex/_generated/dataModel.js';
	import { useConvexClient } from 'convex-svelte';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow,
	} from '$lib/components/ui/table/index.js';
	import { ButtonGroup } from '$lib/components/ui/button-group/index.js';
	import { PlusIcon } from '@lucide/svelte';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	const client = useConvexClient();

	let { data } = $props();

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('de-DE', {
			style: 'currency',
			currency: 'EUR',
		}).format(amount / 100);
	}

	function getTotalAmount(invoice: any): number {
		return invoice.articles.reduce(
			(acc: number, article: any) => acc + article.quantity * article.price,
			0,
		);
	}

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
	
	function debounce<T>(fn: (value: T) => Promise<void>): (value: T) => void {
		let debounceTimer: ReturnType<typeof setTimeout> | null = null;

		return (value: T) => {
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}
			debounceTimer = setTimeout(async () => {
				await fn(value);
			}, 500);
		};
	}

	let updateNotes = debounce((event: Event) => updateValue('notes', event));
	let updateEmail = debounce((event: Event) => updateValue('email', event));
	let updatePhone = debounce((event: Event) => updateValue('phone', event));
</script>

{#if query.data}
	{@const customer = query.data.customer}
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
		<div class="text-gray-500">###</div>
	</SiteHeader>

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
					<InputGroup.Input value={customer.email} type="email" placeholder="Email" oninput={updateEmail} onkeydown={updateEmail} />
					<InputGroup.Addon align="inline-end">
						<InputGroup.Button>
							<CopyIcon class="h-4 w-4" />
						</InputGroup.Button>
					</InputGroup.Addon>
				</InputGroup.Root>
				<InputGroup.Root>
					<InputGroup.Addon align="inline-start">
						<PhoneIcon class="h-4 w-4" />
					</InputGroup.Addon>
					<InputGroup.Input value={customer.phone} type="tel" placeholder="Telefon" oninput={updatePhone} onkeydown={updatePhone} />
					<InputGroup.Addon align="inline-end">
						<InputGroup.Button>
							<CopyIcon class="h-4 w-4" />
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
				{query.data.customer.invoiceCity}<br />
				{customer.invoiceState}{#if customer.invoiceState && customer.invoiceCountry}
					-
				{/if}{customer.invoiceCountry}
			</CardContent>
			<CardFooter>
				<ButtonGroup>
					<Button variant="outline">
						<EditIcon class="h-4 w-4" />
						Adresse bearbeiten
					</Button>
				</ButtonGroup>
			</CardFooter>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle>Notizen</CardTitle>
			</CardHeader>
			<CardContent>
				<Textarea
					value={customer.notes}
					onchange={updateNotes}
					onkeydown={updateNotes}
				/>
			</CardContent>
		</Card>
	</div>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<Card>
			<CardHeader>
				<CardTitle>Erfasste Zeit</CardTitle>
			</CardHeader>
			<CardContent>
				<p>Keine Zeit erfasst.</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle>Rechnungen</CardTitle>
			</CardHeader>
			<CardContent>
				{#if query.data.invoices.length === 0}
					<div class="py-8 text-center text-muted-foreground">
						<p>Keine Rechnungen gefunden.</p>
					</div>
				{:else}
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Rechnungsnummer</TableHead>
								<TableHead>Gestellt am</TableHead>
								<TableHead>Fällig in</TableHead>
								<TableHead>Betrag</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{#each query.data.invoices as invoice}
								<TableRow>
									<TableCell>
										{invoice.number}
									</TableCell>
									<TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
									<TableCell>TODO</TableCell>
									<TableCell>{formatCurrency(getTotalAmount(invoice))}</TableCell>
								</TableRow>
							{/each}
						</TableBody>
					</Table>
				{/if}
			</CardContent>
			<CardFooter>
				<ButtonGroup>
					<ButtonGroup>
						<a
							href="/app/customers/{customer._id}/invoices"
							class={buttonVariants({ variant: 'outline' })}
						>
							Alle anzeigen
						</a>
					</ButtonGroup>
					<ButtonGroup>
						<a
							href="/app/customers/{customer._id}/invoices/new"
							class={buttonVariants({ variant: 'outline' })}
						>
							<PlusIcon />
							Hinzufügen
						</a>
					</ButtonGroup>
				</ButtonGroup>
			</CardFooter>
		</Card>
	</div>
{/if}
