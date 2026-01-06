<script lang="ts">
	import { SidebarGroupAction } from './ui/sidebar';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { action } from '$lib/action.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { useConvexClient } from 'convex-svelte';
	import { api } from '$convex/_generated/api';
	import { goto } from '$app/navigation';
	import { Spinner } from '$lib/components/ui/spinner';
    
	const client = useConvexClient();

	let name = $state('');
	let open = $state(false);

	const newCompany = action(async (event: Event) => {
		event.preventDefault();

		const companyId = await client.mutation(api.companies.create, { name });
		open = false;
		name = '';

		await goto(`/app/company/${companyId}`);
	}, 'Fehler beim Erstellen der Firma');
</script>

<Dialog.Root {open} onOpenChange={(value) => (open = value)}>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<SidebarGroupAction {...props}>
				<PlusIcon />
			</SidebarGroupAction>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Neue Firma</Dialog.Title>
			<Dialog.Description>Bitte geben Sie den Namen der Firma ein.</Dialog.Description>
		</Dialog.Header>
		<form onsubmit={newCompany.run} class="flex flex-col gap-4">
			<Input type="text" placeholder="Name" name="name" bind:value={name} />
			<Dialog.Footer>
				<Button
					variant="outline"
					onclick={() => {
						open = false;
					}}>Abbrechen</Button
				>
				<Button type="submit">
					{#if newCompany.isLoading}
						<Spinner />
					{:else}
						<PlusIcon />
					{/if}
					Hinzufügen
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
