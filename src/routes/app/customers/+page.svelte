<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$convex/_generated/api.js';
	import SiteHeader from '$lib/components/site-header.svelte';
	import Suspense from '$lib/components/Suspense.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { ButtonGroup } from '$lib/components/ui/button-group';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow,
	} from '$lib/components/ui/table';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import SearchIcon from '@lucide/svelte/icons/search';
	import { useConvexClient, useQuery } from 'convex-svelte';

	let search = $state('');

	const client = useConvexClient();

	let newCustomerOpen = $state(false);

	async function handleNewCustomerSubmit(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const name = formData.get('name') as string;

		const { _id } = await client.mutation(api.customers.create, {
			name: name,
		});

		newCustomerOpen = false;

		await goto(`/app/customers/${_id}`);
	}

	const query = useQuery(api.customers.list, {});
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item>Kunden</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>

<SiteHeader>Kunden</SiteHeader>

<ButtonGroup>
	<ButtonGroup>
		<InputGroup.Root class="w-sm">
			<InputGroup.Input placeholder="Search..." bind:value={search} />
			<InputGroup.Addon>
				<SearchIcon />
			</InputGroup.Addon>
		</InputGroup.Root>
	</ButtonGroup>
	<ButtonGroup>
		<Button
			variant="outline"
			onclick={() => {
				newCustomerOpen = true;
			}}><PlusIcon /> Kunde hinzufügen</Button
		>
	</ButtonGroup>
</ButtonGroup>

<Suspense {query} class="h-[60vh]">
	{#snippet children(customers)}
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Invoice Address</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each customers as customer}
					<a href={`/app/customers/${customer._id}`} class="contents">
						<TableRow>
							<TableCell>
								{customer.name}
							</TableCell>
							<TableCell>{customer.email}</TableCell>
							<TableCell>
								<div class="text-sm">
									{customer.invoiceStreet}<br />
									{customer.invoiceZip}
									{customer.invoiceCity}<br />
									{customer.invoiceState}{#if customer.invoiceState && customer.invoiceCountry}
										-
									{/if}{customer.invoiceCountry}
								</div>
							</TableCell>
						</TableRow>
					</a>
				{/each}
			</TableBody>
		</Table>
	{/snippet}
</Suspense>

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
			<form onsubmit={handleNewCustomerSubmit} class="flex flex-col gap-4">
				<Input type="text" placeholder="Name" name="name" />
				<Dialog.Footer>
					<Button
						variant="outline"
						onclick={() => {
							newCustomerOpen = false;
						}}>Abbrechen</Button
					>
					<Button type="submit">Hinzufügen</Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
