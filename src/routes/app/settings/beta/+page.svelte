<script lang="ts">
	import { api } from '$convex/_generated/api.js';
	import { useConvexClient } from 'convex-svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { action } from '$lib/action.svelte';
	const client = useConvexClient();

	let email = $state('');
	let addBetaUser = action(async () => {
		await client.action(api.beta.addBetaUser, { email });
	}, 'Fehler beim Hinzufügen des Beta-Benutzers');
</script>

<form class="flex gap-2" onsubmit={(ev) => {
    ev.preventDefault();
    addBetaUser.run({ email });
}}>
<Input type="email" name="email" placeholder="Email" bind:value={email} />
<Button type="submit" onclick={() => addBetaUser.run(email)}>
	{#if addBetaUser.isLoading}
		Loading..
	{:else}
		Add Beta User
	{/if}
</Button>
</form>
