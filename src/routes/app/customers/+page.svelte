<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$lib/components/ui/table';
	import PlusIcon from '@lucide/svelte/icons/plus';

	const { data } = $props();
</script>

<div>
	<h1 class="text-2xl font-bold">Customers</h1>
	<div class="mt-4 flex flex-row gap-4">
		<a href="/app/customers/new" class={buttonVariants({ variant: 'outline' })}>
			<PlusIcon />
			Add Customer
		</a>
	</div>
	
	<div class="mt-6">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Phone</TableHead>
					<TableHead>Address</TableHead>
					<TableHead>Customer Number</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each data.customers as customer}
					<TableRow>
						<TableCell>
							<a href={`/app/customers/${customer.id}`} class="font-medium text-blue-600 hover:text-blue-800 hover:underline">
								{customer.name}
							</a>
						</TableCell>
						<TableCell>{customer.email || '-'}</TableCell>
						<TableCell>{customer.phone || '-'}</TableCell>
						<TableCell>
							{#if customer.street || customer.city || customer.state || customer.zip}
								<div class="text-sm">
									{#if customer.street}{customer.street}<br/>{/if}
									{#if customer.city || customer.state || customer.zip}
										{customer.city}{#if customer.city && customer.state}, {/if}{customer.state} {customer.zip}
									{/if}
								</div>
							{:else}
								-
							{/if}
						</TableCell>
						<TableCell>{customer.customerNumber || '-'}</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
