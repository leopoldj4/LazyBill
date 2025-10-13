<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import CircleDollarSignIcon from '@lucide/svelte/icons/circle-dollar-sign';

	let { data } = $props();
</script>

<h1 class="text-3xl font-bold">Dashboard</h1>

<div class="grid grid-cols-3 gap-4">
	<Card.Root>
		<Card.Content class="flex justify-between items-center">
			<p class="text-3xl">0,00 €</p>
		</Card.Content>

		<Card.Header>
			<Card.Title>Open sums</Card.Title>
		</Card.Header>
	</Card.Root>

	<Card.Root>
		<Card.Content>
			<p class="text-3xl">{data.customersCount}</p>
		</Card.Content>

		<Card.Header>
			<Card.Title>Customers</Card.Title>
		</Card.Header>
        
	</Card.Root>

    <Card.Root>
		<Card.Content>
			<p class="text-3xl">{data.invoicesCount}</p>
		</Card.Content>

		<Card.Header>
			<Card.Title>Total Invoices</Card.Title>
		</Card.Header>
        
	</Card.Root>
</div>
