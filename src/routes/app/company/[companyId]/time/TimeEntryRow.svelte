<script lang="ts">
	import { api } from '$convex/_generated/api';
	import type { Doc, Id } from '$convex/_generated/dataModel';
	import { action } from '$lib/action.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropDownMenu from '$lib/components/ui/dropdown-menu';
	import { formatDateTimeDisplay, parseDateTime, formatDateTimeRange, calculateDuration } from '$lib/date';
	import { prompt } from '$lib/prompt.svelte';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import MoreHorizontalIcon from '@lucide/svelte/icons/more-horizontal';
	import { getLocalTimeZone } from '@internationalized/date';
	import { useConvexClient } from 'convex-svelte';
	import type TimeEntryDialog from './TimeEntryDialog.svelte';

	let {
		entry,
		customer,
		invoice,
		timeEntryDialog,
	}: {
		entry: Doc<'timeEntries'>;
		customer?: Doc<'customers'>;
		invoice?: Doc<'invoices'> & { customer: Doc<'customers'> | null };
		timeEntryDialog: ReturnType<typeof TimeEntryDialog>;
	} = $props();

	const client = useConvexClient();

	const remove = action(async (params: { id: Id<'timeEntries'> }) => {
		if (await prompt('Löschen', 'Sind Sie sicher, dass Sie diesen Zeiteintrag löschen möchten?')) {
			await client.mutation(api.timeEntries.remove, params);
		}
	}, 'Fehler beim Löschen des Zeiteintrags');
</script>

<div class="flex justify-between gap-4 rounded-md border px-4 py-3">
	<div class="flex w-full flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
		<div class="flex flex-1 flex-col gap-1">
			<span class="text-lg font-medium">{entry.description || 'Kein Titel'}</span>
			<div class="flex items-center gap-2 text-sm text-muted-foreground">
				<ClockIcon class="size-4" />
				<span>{formatDateTimeRange(entry.startDateTime, entry.endDateTime!)}</span>
				<span class="text-xs">({calculateDuration(entry.startDateTime, entry.endDateTime!)})</span>
			</div>
		</div>
		<div class="flex flex-wrap gap-2">
			{#if customer}
				<Badge variant="outline">{customer.name}</Badge>
			{/if}
			{#if invoice}
				<Badge variant="secondary">#{invoice.number}</Badge>
			{/if}
		</div>
	</div>
	<DropDownMenu.Root>
		<DropDownMenu.Trigger>
			{#snippet children()}
				<Button variant="ghost" size="icon">
					<MoreHorizontalIcon class="size-4" />
				</Button>
			{/snippet}
		</DropDownMenu.Trigger>
		<DropDownMenu.Content align="end">
			<DropDownMenu.Item onclick={() => timeEntryDialog.edit(entry)}>
				Bearbeiten
			</DropDownMenu.Item>
			<DropDownMenu.Separator />
			<DropDownMenu.Item onclick={() => remove.run({ id: entry._id })}>Löschen</DropDownMenu.Item>
		</DropDownMenu.Content>
	</DropDownMenu.Root>
</div>
