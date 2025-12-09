<script lang="ts">
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow,
	} from '$lib/components/ui/table';
	import { Separator } from '$lib/components/ui/separator';
	import EyeIcon from '@lucide/svelte/icons/eye';
	import EditIcon from '@lucide/svelte/icons/edit';
	import TrashIcon from '@lucide/svelte/icons/trash';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import SiteHeader from '$lib/components/site-header.svelte';
	import { ButtonGroup } from '$lib/components/ui/button-group/index.js';

	import { formatDistance, subDays } from 'date-fns';
	import Button from '$lib/components/ui/button/button.svelte';
	import { PlusIcon } from '@lucide/svelte';

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
			{data.customer.email}<br />
			{data.customer.phone}
		</CardContent>
	</Card>
	<Card>
		<CardHeader>
			<CardTitle>Notizen</CardTitle>
		</CardHeader>
		<CardContent>
			{data.customer.notes}
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
			<a href="/app/customers/{data.customer.id}/invoices" class={buttonVariants({ variant: 'outline' })}>
				Alle anzeigen
			</a>
		</ButtonGroup>
		<ButtonGroup>
			<a href="/app/customers/{data.customer.id}/invoices/new" class={buttonVariants({ variant: 'outline' })}>
				<PlusIcon />
				Hinzufügen
			</a>
		</ButtonGroup>
		</ButtonGroup>
		</CardFooter>
	</Card>
</div>
