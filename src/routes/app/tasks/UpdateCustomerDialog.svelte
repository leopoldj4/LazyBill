<script lang="ts">
	import { api } from '$convex/_generated/api';
	import type { Doc, Id } from '$convex/_generated/dataModel';
	import { action } from '$lib/action.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import * as Select from '$lib/components/ui/select';
	import Suspense from '$lib/components/Suspense.svelte';
	import { Spinner } from '$lib/components/ui/spinner';

	const query = useQuery(api.customers.list, () => ({
		archived: false,
	}));

	const client = useConvexClient();

	let open = $state(false);
	let task: Doc<'tasks'> | undefined = $state(undefined);
	let customerId = $state<Id<'customers'> | undefined>(undefined);

	const updateCustomer = action(
		async (params: { id: Id<'tasks'>; customerId?: Id<'customers'> }) => {
			await client.mutation(api.tasks.updateCustomer, params);
			open = false;
		},
		'Fehler beim Aktualisieren des Kunden der Aufgabe',
	);

	export function updateTaskCustomer(which: Doc<'tasks'>) {
		task = which;
		customerId = task.customerId;
		open = true;
	}

	$effect(() => {
		if (!open) {
			task = undefined;
			customerId = undefined;
		}
	});
</script>

<Suspense query={query}>
	{#snippet children(customers)}
		<Dialog.Root bind:open>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Kunde ändern</Dialog.Title>
					<Dialog.Description>Bitte wählen Sie einen Kunden aus.</Dialog.Description>
				</Dialog.Header>
				<Select.Root type="single" bind:value={customerId}>
					<Select.Trigger class="w-full">
						{customerId
							? customers.find((customer) => customer._id === customerId)?.name
							: 'Kein Kunde ausgewählt'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">Kein Kunde</Select.Item>
						<Select.Separator />
						{#each customers as customer}
							<Select.Item value={customer._id}>{customer.name}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<Dialog.Footer>
					<Button variant="outline" onclick={() => (open = false)}>Abbrechen</Button>
					<Button
						onclick={() =>
							updateCustomer.run({
								id: task!._id,
								customerId: customerId || undefined,
							})}
					>
						{#if updateCustomer.isLoading}
							<Spinner class="size-4" />
						{:else}
							Speichern
						{/if}
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	{/snippet}
</Suspense>
