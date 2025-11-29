<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$lib/components/ui/table';
	import { Separator } from '$lib/components/ui/separator';
	import EyeIcon from '@lucide/svelte/icons/eye';
	import EditIcon from '@lucide/svelte/icons/edit';
	import TrashIcon from '@lucide/svelte/icons/trash';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import { buttonVariants } from '$lib/components/ui/button';

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

	function getTotalAmount(invoice: any): number {
		return invoice.articles.reduce(
			(acc: number, article: any) => acc + article.quantity * article.price,
			0,
		);
	}
</script>

<div>
	<!-- Header with back button -->
	<div class="flex items-center justify-between mb-6">
		<div class="flex items-center gap-4">
			<a href="/app/customers" class={buttonVariants({ variant: 'outline', size: 'sm' })}>
				<ArrowLeftIcon class="h-4 w-4" />
				Back to Customers
			</a>
			<h1 class="text-2xl font-bold">{data.customer.name}</h1>
		</div>
		<a href="/app/customers/{data.customer.id}/edit" class={buttonVariants({ variant: 'outline' })}>
			<EditIcon class="h-4 w-4" />
			Edit Customer
		</a>
	</div>

	<!-- Customer Information -->
	<Card class="mb-6">
		<CardHeader>
			<CardTitle>Customer Information</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Basic Information -->
				<div class="space-y-4">
					<div>
						<h3 class="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Basic Information</h3>
						<div class="mt-2 space-y-2">
							<div>
								<span class="font-medium">Customernumber:</span> {data.customer.customerNumber}
							</div>
							<div>
								<span class="font-medium">Name:</span> {data.customer.name}
							</div>
							{#if data.customer.representative}
								<div>
									<span class="font-medium">Representative:</span> {data.customer.representative}
								</div>
							{/if}
							{#if data.customer.email}
								<div>
									<span class="font-medium">Email:</span> 
									<a href="mailto:{data.customer.email}" class="text-blue-600 hover:text-blue-800 hover:underline ml-1">
										{data.customer.email}
									</a>
								</div>
							{/if}
							{#if data.customer.phone}
								<div>
									<span class="font-medium">Phone:</span> 
									<a href="tel:{data.customer.phone}" class="text-blue-600 hover:text-blue-800 hover:underline ml-1">
										{data.customer.phone}
									</a>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Invoice Address Information -->
				<div class="space-y-4">
					<div>
						<h3 class="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Invoice Address</h3>
						<div class="mt-2">
							{#if data.customer.invoiceName || data.customer.invoiceStreet || data.customer.invoiceCity || data.customer.invoiceState || data.customer.invoiceZip || data.customer.invoiceCountry}
								<div class="space-y-1">
									{#if data.customer.invoiceName}
										<div class="font-medium">{data.customer.invoiceName}</div>
									{/if}
									{#if data.customer.invoiceStreet}
										<div>{data.customer.invoiceStreet}</div>
									{/if}
									{#if data.customer.invoiceStreetExtra}
										<div>{data.customer.invoiceStreetExtra}</div>
									{/if}
									{#if data.customer.invoiceCity || data.customer.invoiceState || data.customer.invoiceZip}
										<div>
											{data.customer.invoiceCity}{#if data.customer.invoiceCity && data.customer.invoiceState}, {/if}
											{data.customer.invoiceState} {data.customer.invoiceZip}
										</div>
									{/if}
									{#if data.customer.invoiceCountry}
										<div>{data.customer.invoiceCountry}</div>
									{/if}
									{#if data.customer.invoicePhone}
										<div class="pt-2">
											<span class="font-medium">Phone:</span> 
											<a href="tel:{data.customer.invoicePhone}" class="text-blue-600 hover:text-blue-800 hover:underline ml-1">
												{data.customer.invoicePhone}
											</a>
										</div>
									{/if}
								</div>
							{:else}
								<span class="text-muted-foreground">No invoice address provided</span>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</CardContent>
	</Card>

	<!-- Invoices Section -->
	<Card>
		<CardHeader>
			<CardTitle>Invoices ({data.invoices.length})</CardTitle>
		</CardHeader>
		<CardContent>
			{#if data.invoices.length === 0}
				<div class="py-8 text-center text-muted-foreground">
					<p>No invoices found for this customer.</p>
				</div>
			{:else}
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Invoice #</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Due Date</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{#each data.invoices as invoice}
							<TableRow>
								<TableCell class="font-medium">
									{invoice.invoiceNumber}
								</TableCell>
								<TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
								<TableCell>{formatDate(invoice.invoiceDueDate)}</TableCell>
								<TableCell>{formatCurrency(getTotalAmount(invoice))}</TableCell>
								<TableCell>
									{@const isOverdue = new Date(invoice.invoiceDueDate) < new Date()}
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {isOverdue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
										{isOverdue ? 'Overdue' : 'Current'}
									</span>
								</TableCell>
								<TableCell>
									<div class="flex items-center gap-2">
										<a
											class="text-muted-foreground hover:text-foreground"
											href={`/app/invoices/${invoice.id}`}
											title="View Invoice"
										>
											<EyeIcon class="h-4 w-4" />
										</a>
										<button 
											class="text-muted-foreground hover:text-foreground"
											title="Edit Invoice"
										>
											<EditIcon class="h-4 w-4" />
										</button>
										<button 
											class="text-muted-foreground hover:text-destructive"
											title="Delete Invoice"
										>
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
