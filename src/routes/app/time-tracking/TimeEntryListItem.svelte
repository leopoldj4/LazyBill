<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import type { Customer, TimeEntry } from '$lib/server/db/schema';
	import EditIcon from '@lucide/svelte/icons/edit';
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import TrashIcon from '@lucide/svelte/icons/trash';
	import { ContextMenu as ContextMenuPrimitive } from 'bits-ui';

	const { timeEntry, customers }: Props = $props();

	type Props = {
		timeEntry: TimeEntry;
		customers: Customer[];
	};

	function duration(timeEntry: TimeEntry): string {
		if (timeEntry.stopTime) {
			const duration = timeEntry.stopTime.getTime() - timeEntry.startTime.getTime();
			const hours = Math.floor(duration / 3600000);
			const minutes = Math.floor((duration % 3600000) / 60000);
			let str = `${hours.toString()}h`;
			if (minutes > 0) {
				str += `${minutes.toString()}m`;
			}
			return str;
		}
		return '-';
	}

	function formatTime(time: Date): string {
		return (
			time.getUTCHours().toString().padStart(2, '0') +
			':' +
			time.getUTCMinutes().toString().padStart(2, '0')
		);
	}
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		<a href={`/app/time-tracking/${timeEntry.id}`}>
			<Card.Root>
				<Card.Content>
					<div class="flex flex-row items-center justify-between gap-6">
						<div class="flex flex-row items-center gap-6">
							<div class="text-lg text-nowrap">{duration(timeEntry)}</div>

							<div class="flex flex-col">
								<div class="text-xs text-nowrap text-muted-foreground">
									{timeEntry.customerId
										? customers.find((customer) => customer.id === timeEntry.customerId)!.name
										: 'Without customer'}
								</div>
								<div class="text-lg">
									{timeEntry.description}
								</div>
							</div>
						</div>

						<div class="flex flex-row items-center gap-6">
							<div class="text-nowrap">
								{formatTime(timeEntry.startTime)}
								{#if timeEntry.stopTime}
									&mdash;
									{formatTime(timeEntry.stopTime)}
								{/if}
							</div>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</a>
	</ContextMenu.Trigger>
	<ContextMenuPrimitive.Portal>
		<ContextMenu.Content>
			<ContextMenu.Item>
				<EditIcon />
				Edit
			</ContextMenu.Item>
			<ContextMenu.Separator />
			<ContextMenu.Item>
				<TrashIcon />
				Delete
			</ContextMenu.Item>
		</ContextMenu.Content>
	</ContextMenuPrimitive.Portal>
</ContextMenu.Root>
