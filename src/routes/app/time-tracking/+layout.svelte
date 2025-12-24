<script lang="ts">
	import SiteHeader from '$lib/components/site-header.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Popover from '$lib/components/ui/popover';
	import * as Select from '$lib/components/ui/select';
	import { cn } from '$lib/utils.js';
	import { type DateValue } from '@internationalized/date';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import SquareIcon from '@lucide/svelte/icons/square';
	import TimerIcon from '@lucide/svelte/icons/timer';
	import XIcon from '@lucide/svelte/icons/x';
	import { onDestroy } from 'svelte';
	import TimeEntryView from './TimeEntryList.svelte';
	import { page } from '$app/state';
	import {
		startTimeEntry,
		updateTimeEntry,
		deleteTimeEntry,
		createManualTimeEntry,
	} from './data.remote';

	const { children, data } = $props();

	let description = $state<string>('');

	let trackingEntryId = $state<string | undefined>(undefined);
	let trackingStartTime = $state<Date | undefined>(undefined);
	let trackingInterval = $state<NodeJS.Timeout | undefined>(undefined);
	let trackingDisplay = $state<string | undefined>(undefined);

	async function startTracking() {
		const startTime = new Date();

		// Save the entry immediately and get its ID
		const entry = await startTimeEntry({
			description,
			customerId: customerId || null,
			startTime: startTime.toISOString(),
		});

		trackingEntryId = entry.id;
		trackingStartTime = startTime;
		trackingDisplay = '00:00:00';
		window.onbeforeunload = () => {
			return 'You are currently tracking time. Are you sure you want to leave?';
		};
		trackingInterval = setInterval(() => {
			const elapsed = new Date().getTime() - trackingStartTime!.getTime();

			const hours = Math.floor(elapsed / 3600000);
			const minutes = Math.floor((elapsed % 3600000) / 60000);
			const seconds = Math.floor((elapsed % 60000) / 1000);

			trackingDisplay = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		}, 1000);
	}

	async function abortTracking() {
		// Delete the time entry if it was created
		if (trackingEntryId) {
			await deleteTimeEntry({ id: trackingEntryId });
		}

		clearInterval(trackingInterval);
		trackingEntryId = undefined;
		trackingStartTime = undefined;
		trackingDisplay = undefined;
		window.onbeforeunload = null;
	}

	async function stopTracking() {
		if (!trackingEntryId) return;

		const stopTime = new Date();

		// Update the existing entry with the stop time
		await updateTimeEntry({
			id: trackingEntryId,
			description,
			customerId: customerId || null,
			stopTime: stopTime.toISOString(),
		});

		clearInterval(trackingInterval);
		trackingEntryId = undefined;
		trackingStartTime = undefined;
		trackingDisplay = undefined;
		window.onbeforeunload = null;
		description = '';
		customerId = undefined;
		selectedDate = undefined;
	}

	onDestroy(() => {
		if (trackingInterval) {
			clearInterval(trackingInterval);
		}
	});

	let selectedDate = $state<DateValue | undefined>(undefined);
	let customerId = $state<string | undefined>(undefined);

	// Manual entry dialog state
	let manualStartTime = $state<string>('09:00');
	let manualEndTime = $state<string>('17:00');
	let manualDialogOpen = $state<boolean>(false);

	async function saveManualEntry() {
		if (!selectedDate) return;

		await createManualTimeEntry({
			description,
			customerId: customerId || null,
			date: selectedDate.toString(),
			startTime: manualStartTime,
			endTime: manualEndTime,
		});

		// Reset form
		description = '';
		customerId = undefined;
		selectedDate = undefined;
		manualStartTime = '09:00';
		manualEndTime = '17:00';
		manualDialogOpen = false;
	}

	// Helper function to calculate duration between two time strings
	function calculateManualDuration(start: string, end: string): string {
		const [startH, startM] = start.split(':').map(Number);
		const [endH, endM] = end.split(':').map(Number);
		const startMinutes = startH * 60 + startM;
		const endMinutes = endH * 60 + endM;
		const diff =
			endMinutes >= startMinutes ? endMinutes - startMinutes : 24 * 60 - startMinutes + endMinutes;
		const hours = Math.floor(diff / 60);
		const minutes = diff % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
	}
</script>

<div
	class={[
		'grid h-full gap-8',
		page.url.pathname !== '/app/time-tracking' && 'grid-cols-[1fr_30vw]',
	]}
>
	<div class="flex flex-col gap-8">
		<SiteHeader>What needs to be done?</SiteHeader>

		<div class="flex flex-row items-center gap-4">
			<Select.Root type="single" bind:value={customerId}>
				<Select.Trigger class="w-[200px]">
					{#if customerId}
						{data.customers.find((customer) => customer.id === customerId)?.name ||
							'Select a customer'}
					{:else}
						Select a customer
					{/if}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="">No customer</Select.Item>
					<Select.Separator />
					<Select.Label>Customers</Select.Label>
					{#each data.customers as customer}
						<Select.Item value={customer.id}>{customer.name}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

			<Input
				type="text"
				placeholder="What are you working on?"
				bind:value={description}
				class="w-full flex-1"
			/>

			{#if trackingStartTime}
				<div class="font-mono text-lg">{trackingDisplay}</div>
				<div class="flex flex-row items-center gap-2">
					<Button variant="outline" onclick={stopTracking}>
						<SquareIcon />
						Stop tracking
					</Button>

					<Button variant="outline" size="icon" onclick={abortTracking}>
						<XIcon />
					</Button>
				</div>
			{:else}
				<Button variant="outline" onclick={startTracking}>
					<TimerIcon />
					Start tracking
				</Button>

				<span class="italic">or</span>

				<Dialog.Root bind:open={manualDialogOpen}>
					<Dialog.Trigger>
						<Button variant="outline">
							<CalendarIcon />
							Enter manually
						</Button>
					</Dialog.Trigger>
					<Dialog.Content class="min-w-xl">
						<Dialog.Title>Enter time manually</Dialog.Title>

						<Input
							type="text"
							class="w-full"
							bind:value={description}
							placeholder="What are you working on?"
						/>

						<div class="grid grid-cols-[80px_1fr] gap-4">
							<Label>Customer</Label>
							<Select.Root type="single" bind:value={customerId}>
								<Select.Trigger class="w-full">
									{#if customerId}
										{data.customers.find((customer) => customer.id === customerId)?.name ||
											'Select a customer'}
									{:else}
										Select a customer
									{/if}
								</Select.Trigger>
								<Select.Content>
									{#each data.customers as customer}
										<Select.Item value={customer.id}>{customer.name}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>

							<Label>Date</Label>
							<Popover.Root>
								<Popover.Trigger>
									{#snippet child({ props })}
										<Button
											variant="outline"
											class={cn(
												'w-full text-left font-normal',
												!selectedDate && 'text-muted-foreground',
											)}
											{...props}
										>
											<CalendarIcon class="mr-2 size-4" />
											{selectedDate ? selectedDate : 'Select a date'}
										</Button>
									{/snippet}
								</Popover.Trigger>

								<Popover.Content class="w-auto p-0">
									<Calendar bind:value={selectedDate} type="single" initialFocus />
								</Popover.Content>
							</Popover.Root>

							<Label>Time</Label>
							<div class="flex flex-row items-center justify-between">
								<div class="flex flex-row items-center gap-4">
									<Input type="time" class="w-[90px]" bind:value={manualStartTime} />
									&mdash;
									<Input type="time" class="w-[90px]" bind:value={manualEndTime} />
								</div>
								<div class="flex items-center gap-4">
									Total:
									<Input
										type="time"
										class="w-[90px]"
										disabled
										value={calculateManualDuration(manualStartTime, manualEndTime)}
									/>
								</div>
							</div>
						</div>

						<div class="mt-4 flex justify-end">
							<Button onclick={saveManualEntry}>Save</Button>
						</div>
					</Dialog.Content>
				</Dialog.Root>
			{/if}
		</div>

		<!-- Time Entries List -->
		<div class="mt-8">
			<h2 class="mb-4 font-display text-2xl">Time Entries</h2>

			{#if data.timeEntries.length > 0}
				<TimeEntryView data={{ timeEntries: data.timeEntries, customers: data.customers }} />
			{:else}
				<div class="py-8 text-center text-gray-500">
					<ClockIcon class="mx-auto mb-4 h-12 w-12 text-gray-300" />
					<p>No time entries yet. Start tracking time to see entries here.</p>
				</div>
			{/if}
		</div>
	</div>

	<div class="flex min-h-full flex-col gap-8">
		{@render children?.()}
	</div>
</div>
