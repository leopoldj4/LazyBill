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
	import * as Card from '$lib/components/ui/card';
	import * as InputGroup from '$lib/components/ui/input-group';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { Spinner } from '$lib/components/ui/spinner';
	import * as Table from '$lib/components/ui/table';
	import { parseDate } from '$lib/date';
	import { exportPDF } from '$lib/typst/export';
	import { invoiceTemplate } from '$lib/typst/invoice.js';
	import { FileDownIcon, MailIcon, SendIcon, UserStarIcon } from '@lucide/svelte';
	import LeftArrowIcon from '@lucide/svelte/icons/arrow-left';
	import RightArrowIcon from '@lucide/svelte/icons/arrow-right';
	import { useQuery } from 'convex-svelte';

	let { data } = $props();

	const query = useQuery(api.invoices.getFull, () => ({
		id: data.invoiceId as Id<'invoices'>,
	}));

	$effect(() => {
		if (query.data && query.data.customer._id !== data.customerId) {
			goto(`/app/customers/${query.data.customer._id}/invoices/${data.invoiceId}/overview`);
		}
	});

	const downloadPdf = action(async () => {
		if (!query.data) return;
		const pdf = await exportPDF(
			invoiceTemplate(
				query.data.company,
				query.data.customer,
				query.data.invoice.articles,
				parseDate(query.data.invoice.date),
				query.data.invoice.number,
				query.data.invoice.dueInDays,
				query.data.invoice.notes,
			),
			`${query.data.customer.name} - Rechnung ${query.data.invoice.number}.pdf`,
		);
	}, 'Fehler beim Herunterladen der Rechnung');

	let enteredEmail = $derived(query.data?.customer.email || '');
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

					<div class="flex flex-row flex-wrap gap-2">
						<Button variant="outline" onclick={downloadPdf.run}>
							{#if downloadPdf.isLoading}
								<Spinner class="size-4" />
							{:else}
								<FileDownIcon class="size-4" />
							{/if}
							PDF herunterladen
						</Button>
						<Popover.Root>
							<Popover.Trigger class={buttonVariants({ variant: 'default' })}>
								<MailIcon class="size-4" />
								E-Mail versenden
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

					<h2>Zusammenfassung</h2>
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

					<h3>Artikel</h3>
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

					<div class="flex flex-row gap-2">
						<Button
							variant="outline"
							href="/app/customers/{data.customer._id}/invoices/{data.invoice._id}/edit"
						>
							<LeftArrowIcon class="size-4" />
							Bearbeiten
						</Button>
						<Button>
							<RightArrowIcon class="size-4" />
							Versendet
						</Button>
					</div>
				</div>
				<Preview
					typstDocument={invoiceTemplate(
						data.company,
						data.customer,
						data.invoice.articles,
						parseDate(data.invoice.date),
						data.invoice.number,
						data.invoice.dueInDays,
						data.invoice.notes,
					)}
				/>
			</div>
		{/if}
	{/snippet}
</Suspense>
