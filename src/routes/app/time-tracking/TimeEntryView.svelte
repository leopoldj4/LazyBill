<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Customer, TimeEntry } from '$lib/server/db/schema';
	import * as Select from '$lib/components/ui/select';
	import UsersIcon from '@lucide/svelte/icons/users';
	import FilterIcon from '@lucide/svelte/icons/filter';
	import DollarSignIcon from '@lucide/svelte/icons/dollar-sign';
	import DebouncedInput from '$lib/components/DebouncedInput.svelte';
	import ClockIcon from '@lucide/svelte/icons/clock';

	type Data = {
		timeEntries: TimeEntry[];
		customers: Customer[];
	};

	type Props = {
		data: Data;
	};

	const { data }: Props = $props();
	let timeEntries = $state(data.timeEntries);

	// Filters
	type SelectedCustomer = '' | 'without' | string;
	let customerId = $state<SelectedCustomer>('');
	let withoutDescription = $state(false);

	let filtered = $derived(
		timeEntries.filter((timeEntry) => {
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

	function formatTime(time: Date): string {
		return (
			time.getUTCHours().toString().padStart(2, '0') +
			':' +
			time.getUTCMinutes().toString().padStart(2, '0')
		);
	}

	function duration(timeEntry: TimeEntry): string {
		if (timeEntry.stopTime) {
			const duration = timeEntry.stopTime.getTime() - timeEntry.startTime.getTime();
			const hours = Math.floor(duration / 3600000);
			const minutes = Math.floor((duration % 3600000) / 60000);
			return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
		}
		return '-';
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
		<div class="flex flex-row items-center gap-4">
			<div class="flex flex-col gap-1 mr-2">
				<div class="text-xs text-nowrap text-muted-foreground">
					{formatTime(timeEntry.startTime)}
					{#if timeEntry.stopTime}
						&mdash;
						{formatTime(timeEntry.stopTime)}
					{/if}
				</div>
				<div class="text-lg text-nowrap">{duration(timeEntry)}</div>
			</div>
			
		</div>
	{/each}
</div>
