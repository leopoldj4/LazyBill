<script lang="ts">
	import { api } from '$convex/_generated/api';
	import type { Doc, Id } from '$convex/_generated/dataModel';
	import { action } from '$lib/action.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as DropDownMenu from '$lib/components/ui/dropdown-menu';
	import { Spinner } from '$lib/components/ui/spinner';
	import { prompt } from '$lib/prompt.svelte';
	import CheckIcon from '@lucide/svelte/icons/check';
	import MoreHorizontalIcon from '@lucide/svelte/icons/more-horizontal';
	import { useConvexClient } from 'convex-svelte';
	import type UpdateCustomerDialog from './UpdateCustomerDialog.svelte';

	let {
		task,
		customer,
		showCustomer,
		updateCustomerDialog,
	}: {
		task: Doc<'tasks'>;
		customer?: Doc<'customers'>;
		showCustomer: boolean;
		updateCustomerDialog: ReturnType<typeof UpdateCustomerDialog>;
	} = $props();

	const client = useConvexClient();

	const setCompleted = action(async (params: { id: Id<'tasks'>; completed: boolean }) => {
		await client.mutation(api.tasks.setCompleted, params);
	}, 'Fehler beim Aktualisieren des Status der Aufgabe');

	const remove = action(async (params: { id: Id<'tasks'> }) => {
		if (await prompt('Löschen', 'Sind Sie sicher, dass Sie diese Aufgabe löschen möchten?')) {
			await client.mutation(api.tasks.remove, params);
		}
	}, 'Fehler beim Löschen der Aufgabe');

	const updateDescription = action(async (params: { id: Id<'tasks'>; description: string }) => {
		await client.mutation(api.tasks.updateDescription, params);
	}, 'Fehler beim Aktualisieren der Beschreibung der Aufgabe');

	let description = $state(task.description);
</script>

<div class="flex justify-between gap-4 rounded-md border px-4 py-2">
	<div class="flex w-full items-center gap-4">
		<Checkbox
			checked={task.completed}
			class="size-6"
			onCheckedChange={(checked) => setCompleted.run({ id: task._id, completed: checked })}
		></Checkbox>
		<form
			class={['flex flex-1 items-center gap-3', task.completed && 'opacity-50']}
			onsubmit={(ev) => {
				ev.preventDefault();
				updateDescription.run({ id: task._id, description: description });
			}}
		>
			{#if customer && showCustomer}
				<Badge variant="outline">{customer.name}</Badge>
			{/if}
			<input class="w-full text-lg font-medium outline-none" bind:value={description} />
			{#if description !== task.description}
				<Button type="submit">
					{#if updateDescription.isLoading}
						<Spinner />
					{:else}
						<CheckIcon />
					{/if}
					Fertig
				</Button>
			{/if}
		</form>
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
			<DropDownMenu.Item onclick={() => updateCustomerDialog.updateTaskCustomer(task)}>
				Kunde ändern
			</DropDownMenu.Item>
			<DropDownMenu.Separator />
			<DropDownMenu.Item onclick={() => remove.run({ id: task._id })}>Löschen</DropDownMenu.Item>
		</DropDownMenu.Content>
	</DropDownMenu.Root>
</div>
