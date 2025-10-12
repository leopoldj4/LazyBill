<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow,
	} from '$lib/components/ui/table';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import EyeIcon from '@lucide/svelte/icons/eye';
	import EditIcon from '@lucide/svelte/icons/edit';
	import TrashIcon from '@lucide/svelte/icons/trash';

	let { data } = $props();

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('de-DE', {
			style: 'currency',
			currency: 'EUR',
		}).format(amount / 100);
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString();
	}
</script>

<div>
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">Invoices</h1>
		<a href="/app/invoices/new" class={buttonVariants({ variant: 'outline' })}>
			<PlusIcon />
			Add Invoice
		</a>
	</div>

	<Card class="mt-6">
		<CardHeader>
			<CardTitle>All Invoices</CardTitle>
		</CardHeader>
		<CardContent>
			{#if data.invoices.length === 0}
				<div class="py-8 text-center text-muted-foreground">
					<p>No invoices yet. Create your first invoice to get started.</p>
				</div>
			{:else}
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Invoice #</TableHead>
							<TableHead>Customer</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Due Date</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{#each data.invoices as invoice}
							<TableRow>
								<TableCell class="font-medium">
									{invoice.invoiceNumber}
								</TableCell>
								<TableCell>
									<div>
										<div class="font-medium">
											{invoice.customer?.name ?? 'No customer selected'}
										</div>
										<div class="text-sm text-muted-foreground">
											{invoice.customer?.email ?? 'No email'}
										</div>
									</div>
								</TableCell>
								<TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
								<TableCell>{formatDate(invoice.invoiceDueDate)}</TableCell>
								<TableCell
									>{formatCurrency(
										invoice.articles.reduce(
											(acc, article) => acc + article.quantity * article.price,
											0,
										),
									)}</TableCell
								>
								<TableCell>
									<div class="flex items-center gap-2">
										<a
											class="text-muted-foreground hover:text-foreground"
											href={`/app/invoices/${invoice.id}`}
										>
											<EyeIcon class="h-4 w-4" />
										</a>
										<button class="text-muted-foreground hover:text-foreground">
											<EditIcon class="h-4 w-4" />
										</button>
										<button class="text-muted-foreground hover:text-destructive">
											<TrashIcon class="h-4 w-4" />
										</button>
									</div>
								</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
			{/if}
		</CardContent>
	</Card>
</div>
