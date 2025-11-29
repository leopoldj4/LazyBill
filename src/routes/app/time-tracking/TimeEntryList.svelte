<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';
	import type { Customer, TimeEntry } from '$lib/server/db/schema';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import DollarSignIcon from '@lucide/svelte/icons/dollar-sign';
	import FilterIcon from '@lucide/svelte/icons/filter';
	import UsersIcon from '@lucide/svelte/icons/users';
	import TimeEntryListItem from './TimeEntryListItem.svelte';

	type Data = {
		timeEntries: TimeEntry[];
		customers: Customer[];
	};

	type Props = {
		data: Data;
	};

	const { data }: Props = $props();

	// Filters
	type SelectedCustomer = '' | 'without' | string;
	let customerId = $state<SelectedCustomer>('');
	let withoutDescription = $state(false);

	let filtered = $derived(
		data.timeEntries.filter((timeEntry) => {
			if (customerId === '') {
				return true;
			}
			if (customerId === 'without') {
				return timeEntry.customerId === null;
			}
			return timeEntry.customerId === customerId;
		}),
	);

	function resetFilters() {
		customerId = '';
		withoutDescription = false;
	}
</script>

<div class="flex flex-row items-center gap-4">
	<Select.Root type="single" bind:value={customerId}>
		<Select.Trigger>
			<UsersIcon />
			{#if customerId === ''}
				All customers
			{:else if customerId === 'without'}
				Without assigned customer
			{:else}
				{data.customers.find((customer) => customer.id === customerId)!.name}
			{/if}
		</Select.Trigger>
		<Select.Content align="start">
			<Select.Item value="">All customers</Select.Item>
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
		<FilterIcon /> Only Without Description
	</Button>

	<Button variant="outline">
		<DollarSignIcon />
		Show already billed
	</Button>
</div>

<div class="flex flex-col gap-4">
	{#if filtered.length == 0}
		<div class="flex flex-col items-center gap-2 py-12 text-center text-gray-500">
			<ClockIcon class="mx-auto size-12 text-gray-300" />
			<p>No time entries found for this filter</p>
			<Button onclick={resetFilters}>Reset filters</Button>
		</div>
	{/if}
	{#each filtered as timeEntry, i}
		{#if i == 0 || data.timeEntries[i - 1].startTime.getDate() > timeEntry.startTime.getDate()}
			<div class="mt-8 border-b border-border pb-2">
				<h3>{timeEntry.startTime.toLocaleDateString()}</h3>
			</div>
		{/if}
		<TimeEntryListItem {timeEntry} customers={data.customers} />
	{/each}
</div>
