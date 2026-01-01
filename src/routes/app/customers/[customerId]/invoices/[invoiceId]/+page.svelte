<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$convex/_generated/api.js';
	import type { Id } from '$convex/_generated/dataModel.js';
	import { action } from '$lib/action.svelte';
	import Preview from '$lib/components/Preview.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import Suspense from '$lib/components/Suspense.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as InputGroup from '$lib/components/ui/input-group';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Popover from '$lib/components/ui/popover';
	import * as Select from '$lib/components/ui/select';
	import { Spinner } from '$lib/components/ui/spinner';
	import * as Table from '$lib/components/ui/table';
	import { parseDate } from '$lib/date';
	import FileDownIcon from '@lucide/svelte/icons/file-down';
	import MailIcon from '@lucide/svelte/icons/mail';
	import SendIcon from '@lucide/svelte/icons/send';
	import UserStarIcon from '@lucide/svelte/icons/user-star';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { InvoiceStateDetail } from '$lib/invoiceState';
	import type { InvoiceState } from '$convex/invoiceState';
	import { download } from '$lib/download';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import { prompt } from '$lib/prompt.svelte';
	let { data } = $props();

	const query = useQuery(api.invoices.getFull, () => ({
		id: data.invoiceId as Id<'invoices'>,
	}));

	$effect(() => {
		if (query.data && query.data.customer._id !== data.customerId) {
			goto(`/app/customers/${query.data.customer._id}/invoices/${data.invoiceId}/overview`);
		}
	});

	function downloadPdf() {
		if (!query.data?.file) return;
		download(
			query.data.file,
			`${query.data.customer.name} - Rechnung ${query.data.invoice.number}.pdf`,
		);
	}

	let enteredEmail = $derived(query.data?.customer.email || '');

	const client = useConvexClient();

	const updateInvoiceState = action(async (state: InvoiceState) => {
		if (!query.data) return;
		await client.mutation(api.invoices.updateInvoiceState, {
			id: data.invoiceId as Id<'invoices'>,
			state,
		});
	}, 'Fehler beim Aktualisieren des Status');

	async function edit() {
		if (!query.data) return;
		if ((query.data.invoice.file || query.data.invoice.state !== 'new') && !(await prompt('Bearbeiten', 'Sind Sie sicher, dass Sie diese Rechnung bearbeiten möchten? Das wird das aktuelle PDF überschreiben.'))) return;
		await goto(`/app/customers/${query.data.customer._id}/invoices/${query.data.invoice._id}/edit`);
	}
</script>

<Suspense {query} class="h-[60vh]">
	{#snippet children(data)}
		{#if !data}
			<div class="flex h-full items-center justify-center">
				<p>Kunde nicht gefunden</p>
			</div>
		{:else}
			<div class="grid gap-12 lg:grid-cols-2">
				<div class="flex flex-col gap-8">
					<Breadcrumb.Root>
						<Breadcrumb.List>
							<Breadcrumb.Item>
								<Breadcrumb.Link href="/app/customers">Kunden</Breadcrumb.Link>
							</Breadcrumb.Item>
							<Breadcrumb.Separator />
							<Breadcrumb.Item>
								<Breadcrumb.Link href="/app/customers/{data.customer._id}"
									>{data.customer.name}</Breadcrumb.Link
								>
							</Breadcrumb.Item>
							<Breadcrumb.Separator />
							<Breadcrumb.Item>Rechnung #{data.invoice.number}</Breadcrumb.Item>
						</Breadcrumb.List>
					</Breadcrumb.Root>

					<SiteHeader>Rechnung <span class="text-gray-500">#{data.invoice.number}</span></SiteHeader
					>

					<div class="flex flex-row gap-2 flex-wrap">
						<Select.Root
							type="single"
							bind:value={data.invoice.state as InvoiceState}
							onValueChange={(value) => updateInvoiceState.run(value as InvoiceState)}
						>
							<Select.Trigger>
								{#if updateInvoiceState.isLoading}
									<Spinner class="size-4" />
								{:else}
									{@const Icon = InvoiceStateDetail[data.invoice.state].icon}
									<Icon class="size-4 {InvoiceStateDetail[data.invoice.state].textColor}" />
								{/if}
								{InvoiceStateDetail[data.invoice.state].name}
							</Select.Trigger>
							<Select.Content align="start">
								{#each Object.entries(InvoiceStateDetail) as [name, state]}
									<Select.Item value={name}>
										{@const Icon = state.icon}
										<Icon class="size-4 {state.textColor}" />
										{InvoiceStateDetail[name as InvoiceState].name}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						{#if data.file}
							<Button variant="outline" onclick={downloadPdf}>
								<FileDownIcon class="size-4" />

								PDF
							</Button>
						{/if}
						<Button
							variant="outline"
							onclick={edit}
						>
							<PencilIcon class="size-4" />
							Bearbeiten
						</Button>
					</div>

					<h3 class="text-xl">Zusammenfassung</h3>
					<Table.Root>
						<Table.Body>
							<Table.Row>
								<Table.Cell>Rechnungsnummer</Table.Cell>
								<Table.Cell>#{data.invoice.number}</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>Rechnungsdatum</Table.Cell>
								<Table.Cell>{parseDate(data.invoice.date)}</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>Fälligkeit</Table.Cell>
								<Table.Cell>{data.invoice.dueInDays} Tage</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>Notizen</Table.Cell>
								<Table.Cell>{data.invoice.notes}</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table.Root>

					<h3 class="text-xl">Artikel</h3>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Artikel</Table.Head>
								<Table.Head>Preis</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each data.invoice.articles as article}
								<Table.Row>
									<Table.Cell>{article.name}</Table.Cell>
									<Table.Cell>{article.price}</Table.Cell>
								</Table.Row>
							{/each}
							<Table.Row>
								<Table.Cell class="font-bold">Gesamt</Table.Cell>
								<Table.Cell
									>{data.invoice.articles.reduce(
										(acc, article) => acc + article.price,
										0,
									)}</Table.Cell
								>
							</Table.Row>
						</Table.Body>
					</Table.Root>

					<div class="flex flex-row flex-wrap gap-2">
						<Popover.Root>
							<Popover.Trigger class="{buttonVariants({ variant: 'default' })} hidden">
								<MailIcon class="size-4" />
								E-Mail Senden
							</Popover.Trigger>
							<Popover.Content class="flex flex-col gap-3" align="start">
								<h2 class="text-lg">E-Mail versenden</h2>
								<p class="text-sm text-gray-500">
									LazyBill wird die Rechnung in ihrem Namen an die folgende E-Mail-Adresse senden:
								</p>
								<Label for="email">E-Mail-Adresse</Label>
								<InputGroup.Root>
									<InputGroup.Input
										type="email"
										id="email"
										placeholder="E-Mail-Adresse"
										bind:value={enteredEmail}
									/>
									{#if enteredEmail !== data.customer.email}
										<InputGroup.Addon align="inline-end">
											<InputGroup.Button
												variant="outline"
												onclick={() => {
													enteredEmail = data.customer.email;
												}}
											>
												<UserStarIcon class="size-4" />
											</InputGroup.Button>
										</InputGroup.Addon>
									{/if}
								</InputGroup.Root>
								<div class="flex flex-row gap-2">
									<Button variant="default">
										<SendIcon class="size-4" />
										Für mich senden
									</Button>
								</div>
							</Popover.Content>
						</Popover.Root>
					</div>
				</div>
				{#if data.file}
					<iframe src={data.file} class="aspect-[1/1.5] h-full w-full" />
				{:else}
					<div class="flex aspect-[1/1.5] h-full w-full items-center justify-center">
						<p>Noch nicht bearbeitet</p>
					</div>
				{/if}
			</div>
		{/if}
	{/snippet}
</Suspense>
