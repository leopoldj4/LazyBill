<script lang="ts">
	import SiteHeader from '$lib/components/site-header.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import TimerIcon from '@lucide/svelte/icons/timer';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { onDestroy } from 'svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';

	const { data } = $props();

	let description = $state<string>('');

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
		if (!description.trim()) {
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
		description = '';
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
				<span class="w-full flex-1 text-lg italic">{description}</span>
				<Button variant="outline" onclick={stopTracking}>
					Stop
				</Button>
			</CardContent>
		</Card>
	{:else}
		<Input
			type="text"
			placeholder="What are you working on?"
			bind:value={description}
			class="w-full flex-1"
		/>

		<Button variant="outline" onclick={startTracking} disabled={!description.trim()}>
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

	{#if data.timeEntries.length > 0}
		<div class="space-y-2">
			{#each data.timeEntries as timeEntry (timeEntry.id)}
				<Card>
					<CardContent class="flex items-center justify-between py-4">
						<div class="flex items-center gap-3">
							<ClockIcon class="h-4 w-4 text-gray-500" />
							<div>
								<div class="text-sm font-medium">
									{timeEntry.description}
								</div>
								<div class="text-xs text-gray-500">
									{formatDateTime(new Date(timeEntry.startTime))}
									{#if timeEntry.stopTime}
										— {formatDateTime(new Date(timeEntry.stopTime))}
									{:else}
										<span class="ml-2 font-medium text-green-600">Currently running</span>
									{/if}
								</div>
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
					</CardContent>
				</Card>
			{/each}
		</div>
	{:else}
		<div class="py-8 text-center text-gray-500">
			<ClockIcon class="mx-auto mb-4 h-12 w-12 text-gray-300" />
			<p>No time entries yet. Start tracking time to see entries here.</p>
		</div>
	{/if}
</div>
