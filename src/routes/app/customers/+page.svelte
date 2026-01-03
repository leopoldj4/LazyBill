<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$convex/_generated/api.js';
	import { action } from '$lib/action.svelte';
	import Address from '$lib/components/Address.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import Suspense from '$lib/components/Suspense.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Spinner } from '$lib/components/ui/spinner';
	import * as Table from '$lib/components/ui/table';
	import ArchiveIcon from '@lucide/svelte/icons/archive';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { useConvexClient, useQuery } from 'convex-svelte';

	const client = useConvexClient();

	let newCustomerOpen = $state(false);

	let newCustomer = action(async (event: Event) => {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const name = formData.get('name') as string;

		const { _id } = await client.mutation(api.customers.create, {
			name: name,
		});

		newCustomerOpen = false;

		await goto(`/app/customers/${_id}`);
	}, 'Fehler beim Hinzufügen des Kunden');

	let showArchived = $state(false);

	const query = useQuery(api.customers.list, () => (showArchived ? { archived: true } : {}));
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item>Kunden</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>

<SiteHeader>Kunden</SiteHeader>

<div>
	<Button
		variant="outline"
		onclick={() => {
			newCustomerOpen = true;
		}}
	>
		<PlusIcon /> Kunde hinzufügen
	</Button>
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
					<a href={`/app/customers/${customer._id}`} class="contents">
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
							<a href={`/app/customers/${customer._id}`} class="contents">
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
