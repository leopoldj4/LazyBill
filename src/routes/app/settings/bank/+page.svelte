<script lang="ts">
	import { api } from '$convex/_generated/api';
	import { action } from '$lib/action.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import Suspense from '$lib/components/Suspense.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import LinkIcon from '@lucide/svelte/icons/link';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import BankAccount from './BankAccount.svelte';

	const client = useConvexClient();

	let plaidScript = $state<HTMLScriptElement | null>(null);

	function loadPlaid() {
		if (plaidScript) return;

		plaidScript = document.createElement('script');
		plaidScript.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
		plaidScript.async = true;
		document.body.appendChild(plaidScript);

		return new Promise((resolve) => {
			plaidScript!.onload = () => {
				resolve(true);
			};
		});
	}

	const bankAccounts = useQuery(api.plaid.getBankAccounts, {});

	const createLinkToken = action(async () => {
		const [_, linkToken] = await Promise.all([
			loadPlaid(),
			client.action(api.plaid.createLinkToken, {}),
		]);

		// Open Plaid Link
		// @ts-ignore - Plaid is loaded from CDN
		const handler = Plaid.create({
			token: linkToken,
			onSuccess: async (publicToken: string) => {
				await client.action(api.plaid.exchangePublicToken, { publicToken });
			},
			onExit: (err: any) => {
				if (err != null) {
					toast.error('Fehler beim Erstellen des Link-Tokens');
					console.error('Plaid Link error:', err);
				}
			},
		});

		handler.open();
	}, 'Fehler beim Erstellen des Link-Tokens');

	onMount(() => {
		return () => {
			if (plaidScript) {
				document.body.removeChild(plaidScript);
			}
		};
	});
</script>

<SiteHeader>Bank</SiteHeader>

<div class="space-y-6">
	<div>
		<Button onclick={() => createLinkToken.run(void 0)} disabled={createLinkToken.isLoading}>
			{#if createLinkToken.isLoading}
				<Spinner />
			{:else}
				<LinkIcon />
			{/if}
			Bankverbindung hinzufügen
		</Button>
	</div>

	<div class="space-y-4">
		<h2 class="text-xl">Verbundene Konten</h2>
		<div class="grid gap-4">
			<Suspense query={bankAccounts} class="h-[20vh]">
				{#snippet children(bankAccounts)}
					{#each bankAccounts as account}
						<BankAccount {account} />
					{/each}
				{/snippet}
			</Suspense>
		</div>
	</div>
</div>
