<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Customer, TimeEntry } from '$lib/server/db/schema';
	import * as Select from '$lib/components/ui/select';
	import UsersIcon from '@lucide/svelte/icons/users';
	import FilterIcon from '@lucide/svelte/icons/filter';

	type Data = {
		timeEntries: TimeEntry[];
		customers: Customer[];
	};

	type Props = {
		data: Data;
	};

	const { data }: Props = $props();

	type SelectedCustomer = 'all' | 'without' | string;

	let customerId = $state<SelectedCustomer>('all');

	let withoutDescription = $state(false);
</script>

<div class="flex flex-row items-center gap-4">
	<Select.Root type="single" bind:value={customerId}>
		<Select.Trigger>
			<UsersIcon />
			{#if customerId === 'all'}
				All customers
			{:else if customerId === 'without'}
				Without assigned customer
			{:else}
				{data.customers.find((customer) => customer.id === customerId)!.name}
			{/if}
		</Select.Trigger>
		<Select.Content align="start">
			<Select.Item value="all">All customers</Select.Item>
			<Select.Item value="without">Without assigned customer</Select.Item>
			<Select.Separator />
			<Select.Label>Customers</Select.Label>
			{#each data.customers as customer}
				<Select.Item value={customer.id}>{customer.name}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>

	<Button
		variant={withoutDescription ? 'default' : 'outline'}
		onclick={() => (withoutDescription = !withoutDescription)}
	>
		<FilterIcon /> Without Description
	</Button>
</div>

<div class="flex flex-col gap-4">
	{#each data.timeEntries as timeEntry}
		<div class="flex flex-row items-center gap-4">
            <!-- <Select.Root type="single" bind:value={timeEntry.customerId}>
                <Select.Trigger>
                    {timeEntry.customerId ? data.customers.find((customer) => customer.id === timeEntry.customerId)!.name : 'No customer'}
                </Select.Trigger>
                <Select.Content>
                    {#each data.customers as customer}
                        <Select.Item value={customer.id}>{customer.name}</Select.Item>
                    {/each}
                </Select.Content>
            </Select.Root> -->
			<div>{timeEntry.description}</div>
			<div>{timeEntry.startTime}</div>
			<div>{timeEntry.stopTime}</div>
		</div>
	{/each}
</div>
