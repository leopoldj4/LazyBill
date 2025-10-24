<script lang="ts">
	import SiteHeader from '$lib/components/site-header.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import TimerIcon from '@lucide/svelte/icons/timer';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import CircleStopIcon from '@lucide/svelte/icons/circle-stop';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import { onDestroy } from 'svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';

	const { data } = $props();

	let selectedTask = $state<string | undefined>(undefined);

	let selectedTaskDisplay = $derived.by(() => {
		if (!selectedTask) {
			return 'Select a task';
		}
		const task = data.tasks.find((task) => task.id === selectedTask)!;
		const customer = data.customers.find((customer) => customer.id === task?.customerId)!;
		return `${customer.name} — ${task.name}`;
	});

	let trackingStartTime = $state<Date | undefined>(undefined);
	let trackingInterval = $state<NodeJS.Timeout | undefined>(undefined);
	let trackingDisplay = $state<string | undefined>(undefined);

	// Helper function to format duration
	function formatDuration(startTime: Date, stopTime?: Date): string {
		const end = stopTime || new Date();
		const duration = end.getTime() - startTime.getTime();

		const hours = Math.floor(duration / 3600000);
		const minutes = Math.floor((duration % 3600000) / 60000);
		const seconds = Math.floor((duration % 60000) / 1000);

		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}

	// Helper function to format date/time
	function formatDateTime(date: Date): string {
		return date.toLocaleString();
	}

	function startTracking() {
		if (!selectedTask) {
			return;
		}

		trackingStartTime = new Date();
		trackingDisplay = '00:00:00';
		trackingInterval = setInterval(() => {
			const elapsed = new Date().getTime() - trackingStartTime!.getTime();

			const hours = Math.floor(elapsed / 3600000);
			const minutes = Math.floor((elapsed % 3600000) / 60000);
			const seconds = Math.floor((elapsed % 60000) / 1000);

			trackingDisplay = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		}, 1000);
	}

	function stopTracking() {
		clearInterval(trackingInterval);
		trackingStartTime = undefined;
		trackingDisplay = undefined;
	}

	onDestroy(() => {
		if (trackingInterval) {
			clearInterval(trackingInterval);
		}
	});
</script>

<SiteHeader>What needs to be done?</SiteHeader>

<div class="flex flex-row items-center gap-4">
	{#if trackingStartTime}
		<Card class="w-full">
			<CardContent class="flex flex-row items-center gap-4">
				<span class="font-mono text-3xl">{trackingDisplay}</span>
				<span class="w-full flex-1 text-lg italic">{selectedTaskDisplay}</span>
				<Button variant="outline" onclick={stopTracking}>
					<CircleStopIcon />
					Stop
				</Button>
			</CardContent>
		</Card>
	{:else}
		<Select.Root type="single" bind:value={selectedTask} name="taskId">
			<Select.Trigger class="w-full flex-1">
				{selectedTaskDisplay || 'Select a task'}
			</Select.Trigger>
			<Select.Content>
				{#each data.customers as customer (customer.id)}
					<Select.Group>
						<Select.GroupHeading>{customer.name}</Select.GroupHeading>
						{#each data.tasks.filter((task) => task.customerId === customer.id) as task (task.id)}
							<Select.Item value={task.id}>{task.name}</Select.Item>
						{/each}
					</Select.Group>
				{/each}
			</Select.Content>
		</Select.Root>

		<Button variant="outline" onclick={startTracking}>
			<TimerIcon />
			Track time
		</Button>

		<span class="italic">or</span>

		<Button variant="outline">
			<CalendarIcon />
			Enter manually
		</Button>
	{/if}
</div>

<!-- Time Entries List -->
<div class="mt-8">
	<h2 class="mb-4 text-2xl font-semibold">Time Entries</h2>

	{#each data.customers as customer (customer.id)}
		{#if data.tasks.filter((task) => task.customerId === customer.id && task.timeEntries.length > 0).length > 0}
			<div class="mb-6">
				<h3 class="mb-3 text-lg font-medium text-gray-700">{customer.name}</h3>

				{#each data.tasks.filter((task) => task.customerId === customer.id && task.timeEntries.length > 0) as task (task.id)}
					<Collapsible.Root>
						<Card class="mb-3">
							<Collapsible.Trigger>
								<CardHeader class="cursor-pointer transition-colors hover:bg-gray-50">
									<div class="flex items-center justify-between">
										<CardTitle class="text-base font-medium">{task.name}</CardTitle>
										<div class="flex items-center gap-2">
											<span class="text-sm text-gray-500">
												{task.timeEntries.length} entr{task.timeEntries.length === 1 ? 'y' : 'ies'}
											</span>
											<ChevronDownIcon class="h-4 w-4 transition-transform duration-200" />
										</div>
									</div>
								</CardHeader>
							</Collapsible.Trigger>

							<Collapsible.Content>
								<CardContent class="pt-0">
									<div class="space-y-2">
										{#each task.timeEntries as timeEntry (timeEntry.id)}
											<div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
												<div class="flex items-center gap-3">
													<ClockIcon class="h-4 w-4 text-gray-500" />
													<div>
														<div class="text-sm font-medium">
															{formatDateTime(new Date(timeEntry.startTime))}
														</div>
														{#if timeEntry.stopTime}
															<div class="text-xs text-gray-500">
																Ended: {formatDateTime(new Date(timeEntry.stopTime))}
															</div>
														{:else}
															<div class="text-xs font-medium text-green-600">
																Currently running
															</div>
														{/if}
													</div>
												</div>
												<div class="text-right">
													<div class="font-mono text-sm font-medium">
														{formatDuration(
															new Date(timeEntry.startTime),
															timeEntry.stopTime ? new Date(timeEntry.stopTime) : undefined,
														)}
													</div>
													{#if !timeEntry.stopTime}
														<div class="text-xs text-green-600">Active</div>
													{/if}
												</div>
											</div>
										{/each}
									</div>
								</CardContent>
							</Collapsible.Content>
						</Card>
					</Collapsible.Root>
				{/each}
			</div>
		{/if}
	{/each}

	{#if data.tasks.every((task) => task.timeEntries.length === 0)}
		<div class="py-8 text-center text-gray-500">
			<ClockIcon class="mx-auto mb-4 h-12 w-12 text-gray-300" />
			<p>No time entries yet. Start tracking time to see entries here.</p>
		</div>
	{/if}
</div>
