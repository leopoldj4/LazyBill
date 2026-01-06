<script lang="ts">
	import { api } from '$convex/_generated/api.js';
	import { action } from '$lib/action.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import Suspense from '$lib/components/Suspense.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import Path from '$lib/components/Path.svelte';

	const client = useConvexClient();

	let email = $state('');
	let addBetaUser = action(async () => {
		await client.action(api.beta.addBetaUser, { email });
	}, 'Fehler beim Hinzufügen des Beta-Benutzers');

	let betaUsers = useQuery(api.beta.listBetaUsers, {});
</script>

<Path label="Beta" href="/app/beta" />

<SiteHeader>Beta</SiteHeader>

<h2 class="text-xl">Einladungen</h2>

<form
	class="flex gap-2"
	onsubmit={(ev) => {
		ev.preventDefault();
		addBetaUser.run({ email });
	}}
>
	<Input type="email" name="email" placeholder="Email" bind:value={email} />
	<Button type="submit" onclick={() => addBetaUser.run(email)}>
		{#if addBetaUser.isLoading}
			Loading..
		{:else}
			Add Beta User
		{/if}
	</Button>
</form>

<Suspense query={betaUsers}>
	{#snippet children(betaUsers)}
		<ul class="list-inside list-disc">
			{#each betaUsers as betaUser}
				<li>
					{betaUser.email}
				</li>
			{/each}
		</ul>
	{/snippet}
</Suspense>
