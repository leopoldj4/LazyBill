<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$convex/_generated/api.js';
	import type { Id } from '$convex/_generated/dataModel';
	import { action } from '$lib/action.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import Suspense from '$lib/components/Suspense.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Spinner } from '$lib/components/ui/spinner';
	import * as Table from '$lib/components/ui/table';
	import ArchiveIcon from '@lucide/svelte/icons/archive';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import { useConvexClient, useQuery } from 'convex-svelte';

	const FREE_CUSTOMER_LIMIT = 15;

	const { data } = $props();
	const client = useConvexClient();

	let newCustomerOpen = $state(false);
	let upgradeDialogOpen = $state(false);

	const subscriptionQuery = useQuery(api.subscriptions.getSubscription, {});
	const subscription = $derived(subscriptionQuery.data ?? { plan: 'free', status: 'active' });
	const isPro = $derived(subscription.plan === 'pro' && subscription.status === 'active');
	const customerCount = useQuery(api.companies.getTotalCustomerCount, {});
	const isAtLimit = $derived(!isPro && (customerCount.data ?? 0) >= FREE_CUSTOMER_LIMIT);

	function handleAddCustomer() {
		if (isAtLimit) {
			upgradeDialogOpen = true;
		} else {
			newCustomerOpen = true;
		}
	}

	let newCustomer = action(async (event: Event) => {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const name = formData.get('name') as string;

		const { _id } = await client.mutation(api.customers.create, {
			companyId: data.companyId as Id<'companies'>,
			name: name,
		});

		newCustomerOpen = false;

		await goto(`/app/company/${data.companyId}/customers/${_id}`);
	}, 'Fehler beim Hinzufügen des Kunden');

	let showArchived = $state(false);

	const query = useQuery(api.customers.list, () =>
		showArchived
			? { archived: true, companyId: data.companyId as Id<'companies'> }
			: { companyId: data.companyId as Id<'companies'> },
	);
</script>

<SiteHeader>Kunden</SiteHeader>

<div class="flex items-center gap-2">
	<Button variant="outline" onclick={handleAddCustomer}>
		<PlusIcon /> Kunde hinzufügen
	</Button>
	{#if !isPro && customerCount.data !== undefined}
		<span class="text-sm text-muted-foreground">
			{customerCount.data} / {FREE_CUSTOMER_LIMIT} Kunden
		</span>
	{/if}
</div>

<Suspense {query} class="h-[30vh]">
	{#snippet children(customers)}
		{#if customers.length === 0}
			<div class="flex min-h-[30vh] flex-col items-center justify-center gap-4">
				<p>Keine Kunden gefunden</p>
			</div>
		{:else}
			<div class="flex flex-col gap-2 lg:hidden">
				{#each customers as customer}
					<a href="/app/company/{data.companyId}/customers/{customer._id}" class="contents">
						<Card.Root>
							<Card.Header>
								<Card.Title>{customer.name}</Card.Title>
							</Card.Header>
						</Card.Root>
					</a>
				{/each}
			</div>
			<div class="overflow-hidden rounded-md border">
				<Table.Root class="max-lg:hidden">
					<Table.TableHeader>
						<Table.Row>
							<Table.Head>Name</Table.Head>
							<Table.Head>Email</Table.Head>
						</Table.Row>
					</Table.TableHeader>
					<Table.TableBody>
						{#each customers as customer}
							<a href="/app/company/{data.companyId}/customers/{customer._id}" class="contents">
								<Table.TableRow>
									<Table.TableCell>
										{customer.name}
									</Table.TableCell>
									<Table.TableCell>{customer.email}</Table.TableCell>
								</Table.TableRow>
							</a>
						{/each}
					</Table.TableBody>
				</Table.Root>
			</div>
		{/if}
	{/snippet}
</Suspense>

<Button
	variant={showArchived ? 'default' : 'outline'}
	onclick={() => {
		showArchived = !showArchived;
	}}
>
	<ArchiveIcon />
	Archivierte anzeigen
</Button>

<Dialog.Root
	open={newCustomerOpen}
	onOpenChange={(value) => {
		newCustomerOpen = value;
	}}
>
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Kunde hinzufügen</Dialog.Title>
				<Dialog.Description>Bitte geben Sie den Namen des Kunden ein.</Dialog.Description>
			</Dialog.Header>
			<form onsubmit={newCustomer.run} class="flex flex-col gap-4">
				<Input type="text" placeholder="Name" name="name" />
				<Dialog.Footer>
					<Button
						variant="outline"
						onclick={() => {
							newCustomerOpen = false;
						}}>Abbrechen</Button
					>
					<Button type="submit">
						{#if newCustomer.isLoading}
							<Spinner />
						{:else}
							<PlusIcon />
						{/if}
						Hinzufügen
					</Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<!-- Upgrade Dialog -->
<Dialog.Root
	open={upgradeDialogOpen}
	onOpenChange={(value) => {
		upgradeDialogOpen = value;
	}}
>
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title class="flex items-center gap-2">
					<SparklesIcon class="size-5 text-amber-500" />
					Kundenlimit erreicht
				</Dialog.Title>
				<Dialog.Description>
					Du hast das Limit von {FREE_CUSTOMER_LIMIT} Kunden im kostenlosen Plan erreicht. Upgrade
					auf Pro für unbegrenzte Kunden.
				</Dialog.Description>
			</Dialog.Header>
			<div class="py-4">
				<div class="rounded-lg border bg-gradient-to-br from-amber-50/50 to-orange-50/50 p-4 dark:from-amber-950/20 dark:to-orange-950/20">
					<div class="flex items-baseline gap-1">
						<span class="text-2xl font-bold">10€</span>
						<span class="text-muted-foreground">/ Monat</span>
					</div>
					<ul class="mt-3 space-y-2 text-sm">
						<li>✓ Unbegrenzte Kunden</li>
						<li>✓ Unbegrenzte Rechnungen</li>
						<li>✓ Prioritäts-Support</li>
					</ul>
				</div>
			</div>
			<Dialog.Footer>
				<Button
					variant="outline"
					onclick={() => {
						upgradeDialogOpen = false;
					}}>Später</Button
				>
				<a href="/app/account/billing">
					<Button class="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600">
						<SparklesIcon class="size-4" />
						Jetzt upgraden
					</Button>
				</a>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
