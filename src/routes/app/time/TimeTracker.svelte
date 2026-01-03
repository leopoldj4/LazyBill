<script lang="ts">
	import { api } from '$convex/_generated/api';
	import type { Doc, Id } from '$convex/_generated/dataModel';
	import { action } from '$lib/action.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Spinner } from '$lib/components/ui/spinner';
	import { formatDateTime, parseDateTime } from '$lib/date';
	import { CalendarDateTime, getLocalTimeZone } from '@internationalized/date';
	import PlayIcon from '@lucide/svelte/icons/play';
	import SquareIcon from '@lucide/svelte/icons/square';
	import TrashIcon from '@lucide/svelte/icons/trash-2';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { onDestroy } from 'svelte';

	let {
		customers,
	}: {
		customers: Doc<'customers'>[];
	} = $props();

	const client = useConvexClient();

	const runningEntriesQuery = useQuery(api.timeEntries.getRunning, {});

	let runningEntries = $derived((runningEntriesQuery.data as Doc<'timeEntries'>[] | undefined) ?? []);

	let description = $state('');
	let customerId = $state<Id<'customers'> | undefined>(undefined);

	let elapsedSecondsMap = $state<Record<string, number>>({});
	let intervalId: ReturnType<typeof setInterval> | null = null;

	function calculateElapsedSeconds(entry: Doc<'timeEntries'>): number {
		const start = parseDateTime(entry.startDateTime).toDate(getLocalTimeZone());
		const end = entry.endDateTime
			? parseDateTime(entry.endDateTime).toDate(getLocalTimeZone())
			: new Date();
		return Math.floor((end.getTime() - start.getTime()) / 1000);
	}

	// Update elapsed time every second for all running entries
	$effect(() => {
		if (runningEntries.length > 0) {
			// Clear any existing interval
			if (intervalId) clearInterval(intervalId);

			// Update immediately
			const newMap: Record<string, number> = {};
			for (const entry of runningEntries) {
				newMap[entry._id] = calculateElapsedSeconds(entry);
			}
			elapsedSecondsMap = newMap;

			// Then update every second
			intervalId = setInterval(() => {
				const newMap: Record<string, number> = {};
				for (const entry of runningEntries) {
					newMap[entry._id] = calculateElapsedSeconds(entry);
				}
				elapsedSecondsMap = newMap;
			}, 1000);
		} else {
			// No running entries
			if (intervalId) {
				clearInterval(intervalId);
				intervalId = null;
			}
			elapsedSecondsMap = {};
		}
	});

	function nowDateTimeString(): string {
		const now = new Date();
		return formatDateTime(
			new CalendarDateTime(
				now.getFullYear(),
				now.getMonth() + 1,
				now.getDate(),
				now.getHours(),
				now.getMinutes()
			)
		);
	}

	const startAction = action(async () => {
		await client.mutation(api.timeEntries.start, {
			description: description || 'Zeiteintrag',
			customerId: customerId || undefined,
			startDateTime: nowDateTimeString(),
		});
		description = '';
		customerId = undefined;
	}, 'Fehler beim Starten des Timers');

	const stopAction = action(async (id: Id<'timeEntries'>) => {
		await client.mutation(api.timeEntries.stop, {
			id,
			endDateTime: nowDateTimeString(),
		});
	}, 'Fehler beim Stoppen des Timers');

	const discardAction = action(async (id: Id<'timeEntries'>) => {
		await client.mutation(api.timeEntries.remove, { id });
	}, 'Fehler beim Verwerfen des Zeiteintrags');

	function formatTime(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		const pad = (n: number) => n.toString().padStart(2, '0');

		return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
	}

	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});

	const isLoading = $derived(startAction.isLoading || stopAction.isLoading || discardAction.isLoading);
</script>

<div class="flex flex-col gap-3">
	<!-- Running entries -->
	{#each runningEntries as entry (entry._id)}
		<div class="rounded-lg border bg-card p-4">
			<div class="flex flex-col gap-4">
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-semibold">Timer</h3>
					<div class="font-mono text-3xl font-bold tabular-nums">
						{formatTime(elapsedSecondsMap[entry._id] ?? 0)}
					</div>
				</div>

				<div class="flex flex-col gap-3 lg:flex-row lg:items-end">
					<div class="flex-1">
						<Input type="text" value={entry.description} disabled />
					</div>

					<div class="w-full lg:w-48">
						<Select.Root type="single" value={entry.customerId} disabled>
							<Select.Trigger class="w-full">
								{entry.customerId
									? customers.find((c) => c._id === entry.customerId)?.name
									: 'Kein Kunde'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="">Kein Kunde</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>

					<div class="flex gap-2">
						<Button
							onclick={() => stopAction.run(entry._id)}
							variant="destructive"
							class="gap-2"
							disabled={isLoading}
						>
							{#if stopAction.isLoading}
								<Spinner class="size-4" />
							{:else}
								<SquareIcon class="size-4" />
							{/if}
							Stop
						</Button>
						<Button
							onclick={() => discardAction.run(entry._id)}
							variant="ghost"
							size="icon"
							disabled={isLoading}
						>
							{#if discardAction.isLoading}
								<Spinner class="size-4" />
							{:else}
								<TrashIcon class="size-4" />
							{/if}
						</Button>
					</div>
				</div>
			</div>
		</div>
	{/each}

	<!-- New entry form -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex flex-col gap-4">
			<h3 class="text-lg font-semibold">Neuer Timer</h3>

			<div class="flex flex-col gap-3 lg:flex-row lg:items-end">
				<div class="flex-1">
					<Input type="text" placeholder="Was arbeitest du gerade?" bind:value={description} />
				</div>

				<div class="w-full lg:w-48">
					<Select.Root type="single" bind:value={customerId}>
						<Select.Trigger class="w-full">
							{customerId ? customers.find((c) => c._id === customerId)?.name : 'Kunde wählen'}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="">Kein Kunde</Select.Item>
							<Select.Separator />
							{#each customers as customer}
								<Select.Item value={customer._id}>{customer.name}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<Button onclick={() => startAction.run(undefined)} class="gap-2" disabled={isLoading}>
					{#if startAction.isLoading}
						<Spinner class="size-4" />
					{:else}
						<PlayIcon class="size-4" />
					{/if}
					Start
				</Button>
			</div>
		</div>
	</div>
</div>
