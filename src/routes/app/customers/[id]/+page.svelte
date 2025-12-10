<script lang="ts">
	import SiteHeader from '$lib/components/site-header.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { buttonVariants } from '$lib/components/ui/button';
	import { ButtonGroup } from '$lib/components/ui/button-group/index.js';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow,
	} from '$lib/components/ui/table';
	import PhoneIcon from '@lucide/svelte/icons/phone';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import EditIcon from '@lucide/svelte/icons/edit';
	import MailIcon from '@lucide/svelte/icons/mail';
	import { formatDistance } from 'date-fns';
	import { Textarea } from "$lib/components/ui/textarea";

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
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/app/customers">Kunden</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>{data.customer.name}</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>

<SiteHeader>
	{data.customer.name}
	<div class="text-gray-500">#{data.customer.customerNumber}</div>
</SiteHeader>

<ButtonGroup>
	<a href="/app/customers/{data.customer.id}/edit" class={buttonVariants({ variant: 'outline' })}>
		<EditIcon class="h-4 w-4" />
		Bearbeiten
	</a>
</ButtonGroup>

<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
	<Card>
		<CardHeader>
			<CardTitle>Kontakt</CardTitle>
		</CardHeader>

		<CardContent>
			<div class="flex flex-col gap-2">
				<a href="mailto:{data.customer.email}" class={buttonVariants({ variant: 'outline', class: 'justify-start' })}>
					<MailIcon class="h-4 w-4" />
					{data.customer.email || 'Keine Email'}
				</a>
				<a href="tel:{data.customer.phone}" class={buttonVariants({ variant: 'outline', class: 'justify-start' })}>
					<PhoneIcon class="h-4 w-4" />
					{data.customer.phone || 'Keine Telefonnummer'}
				</a>
				</div>
		</CardContent>
	</Card>
	<Card>
		<CardHeader>
			<CardTitle>Notizen</CardTitle>
		</CardHeader>
		<CardContent>
			<Textarea value={data.customer.notes} rows={10} disabled />
		</CardContent>
	</Card>
	<Card>
		<CardHeader>
			<CardTitle>Adresse</CardTitle>
		</CardHeader>
		<CardContent>
			{data.customer.invoiceStreet}<br />
			{data.customer.invoiceZip}
			{data.customer.invoiceCity}<br />
			{data.customer.invoiceState},
			{data.customer.invoiceCountry}
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
			{#if data.invoices.length === 0}
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
						{#each data.invoices as invoice}
							<TableRow>
								<TableCell>
									{invoice.invoiceNumber}
								</TableCell>
								<TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
								<TableCell>{formatDistance(new Date(invoice.invoiceDueDate), new Date())}</TableCell
								>
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
						href="/app/customers/{data.customer.id}/invoices"
						class={buttonVariants({ variant: 'outline' })}
					>
						Alle anzeigen
					</a>
				</ButtonGroup>
				<ButtonGroup>
					<a
						href="/app/customers/{data.customer.id}/invoices/new"
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
