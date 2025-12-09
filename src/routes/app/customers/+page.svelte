<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow,
	} from '$lib/components/ui/table';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import SiteHeader from '$lib/components/site-header.svelte';
	import { ButtonGroup } from '$lib/components/ui/button-group';

	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import SearchIcon from '@lucide/svelte/icons/search';

	const { data } = $props();

	let search = $state('');
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
		<a href="/app/customers/new" class={buttonVariants({ variant: 'outline' })}>
			<PlusIcon />
			Kunde hinzufügen
		</a>
	</ButtonGroup>
</ButtonGroup>

<Table>
	<TableHeader>
		<TableRow>
			<TableHead>Name</TableHead>
			<TableHead>Email</TableHead>
			<TableHead>Invoice Address</TableHead>
		</TableRow>
	</TableHeader>
	<TableBody>
		{#each data.customers as customer}
			<a href={`/app/customers/${customer.id}`} class="contents">
				<TableRow>
					<TableCell>
						{customer.name}
					</TableCell>
					<TableCell>{customer.email || '-'}</TableCell>
					<TableCell>
						{#if customer.invoiceStreet || customer.invoiceCity || customer.invoiceState || customer.invoiceZip}
							<div class="text-sm">
								{#if customer.invoiceStreet}{customer.invoiceStreet}<br />{/if}
								{#if customer.invoiceCity || customer.invoiceState || customer.invoiceZip}
									{customer.invoiceCity}{#if customer.invoiceCity && customer.invoiceState},
									{/if}{customer.invoiceState}
									{customer.invoiceZip}
								{/if}
							</div>
						{:else}
							-
						{/if}
					</TableCell>
				</TableRow>
			</a>
		{/each}
	</TableBody>
</Table>
