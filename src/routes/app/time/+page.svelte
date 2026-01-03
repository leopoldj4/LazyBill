<script lang="ts">
	import { api } from '$convex/_generated/api';
	import type { Doc, Id } from '$convex/_generated/dataModel';
	import SiteHeader from '$lib/components/site-header.svelte';
	import Suspense from '$lib/components/Suspense.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { useQuery } from 'convex-svelte';
	import TimeEntryRow from './TimeEntryRow.svelte';
	import TimeEntryDialog from './TimeEntryDialog.svelte';
	import TimeTracker from './TimeTracker.svelte';

	const customersQuery = useQuery(api.customers.list, {});
	const invoicesQuery = useQuery(api.invoices.list, {});
	const timeEntriesQuery = useQuery(api.timeEntries.list, {});

	let timeEntryDialog: ReturnType<typeof TimeEntryDialog>;

	let search = $state('');

	type TimeEntry = Doc<'timeEntries'>;

	function filterEntries(entries: TimeEntry[], searchTerm: string): TimeEntry[] {
		// Filter out running entries (those without endDateTime) - they're shown in TimeTracker
		let filtered = entries.filter((entry) => entry.endDateTime);
		if (!searchTerm) return filtered;
		const term = searchTerm.toLowerCase();
		return filtered.filter((entry) => entry.description.toLowerCase().includes(term));
	}

	function sortEntries(entries: TimeEntry[]): TimeEntry[] {
		return entries.toSorted((a, b) => {
			return new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime();
		});
	}
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item>Zeiterfassung</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>

<SiteHeader>Zeiterfassung</SiteHeader>

<Suspense query={customersQuery}>
	{#snippet children(customers)}
		<Suspense query={invoicesQuery}>
			{#snippet children(invoices)}
				<TimeTracker {customers} />
				<div class="flex justify-between gap-2">
					<div class="flex flex-1 gap-2">
						<Input
							type="text"
							placeholder="Suchen ..."
							bind:value={search}
							class="h-8 w-[150px] lg:w-[250px]"
						/>
					</div>
					<Button onclick={() => timeEntryDialog.create()}>
						<PlusIcon />
						Neu
					</Button>
				</div>

				<Suspense query={timeEntriesQuery}>
					{#snippet children(timeEntries)}
						{#if timeEntries.length === 0}
							<div class="flex min-h-[30vh] flex-col items-center justify-center gap-4">
								<p>Keine Zeiteinträge gefunden</p>
							</div>
						{:else}
							<div class="grid gap-2">
								{#each sortEntries(filterEntries(timeEntries, search)) as entry (entry._id)}
									<TimeEntryRow
										{entry}
										customer={customers.find((c) => c._id === entry.customerId)}
										invoice={invoices.find((i) => i._id === entry.invoiceId)}
										{timeEntryDialog}
									/>
								{/each}
							</div>
						{/if}
					{/snippet}
				</Suspense>

				<TimeEntryDialog bind:this={timeEntryDialog} {customers} {invoices} />
			{/snippet}
		</Suspense>
	{/snippet}
</Suspense>
