<script lang="ts">
	import { api } from '$convex/_generated/api';
	import type { Doc } from '$convex/_generated/dataModel';
	import { action } from '$lib/action.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';
	import { useConvexClient } from 'convex-svelte';
	import { toast } from 'svelte-sonner';

	type Props = {
		account: Doc<'bankAccounts'>;
	};
	let { account }: Props = $props();

	const client = useConvexClient();

	let syncTransactions = action(async () => {
		await client.action(api.plaid.syncTransactions, { bankAccountId: account._id });
        toast.success('Transaktionen synchronisiert');
	}, 'Fehler beim Synchronisieren der Transaktionen');
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>
			{account.accountName || 'Bankkonto'}
		</Card.Title>
	</Card.Header>

	<Card.Content>
		<p class="text-muted-foreground">
			{account.accountType}
			{#if account.accountSubtype}
				• {account.accountSubtype}
			{/if}
		</p>
	</Card.Content>

	<Card.Footer class="flex flex-row flex-wrap gap-2">
		<Button
			variant="outline"
			onclick={() => syncTransactions.run(void 0)}
			disabled={syncTransactions.isLoading}
		>
			<RefreshCw class={[syncTransactions.isLoading && 'animate animate-spin']} />
			Synchronisieren
		</Button>
	</Card.Footer>
</Card.Root>
