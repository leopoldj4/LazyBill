<script lang="ts">
	import SiteHeader from '$lib/components/site-header.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select';
	import TimerIcon from '@lucide/svelte/icons/timer';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import CircleStopIcon from '@lucide/svelte/icons/circle-stop';
	import { onDestroy } from 'svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Card from '$lib/components/ui/card/card.svelte';

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
				<span class="text-lg italic flex-1 w-full">{selectedTaskDisplay}</span>
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
