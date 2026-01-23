<script lang="ts">
	import { api } from '$convex/_generated/api.js';
	import { action } from '$lib/action.svelte';
	import Path from '$lib/components/Path.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Spinner } from '$lib/components/ui/spinner';
	import CheckIcon from '@lucide/svelte/icons/check';
	import CrownIcon from '@lucide/svelte/icons/crown';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import UsersIcon from '@lucide/svelte/icons/users';
	import ZapIcon from '@lucide/svelte/icons/zap';
	import { useQuery } from 'convex-svelte';
	import { toast } from 'svelte-sonner';

	const FREE_CUSTOMER_LIMIT = 15;
	const PRO_PRICE_ID = 'price_1SsP1LFKebOu6DdvBUVpG6vv';

	const customerCount = useQuery(api.companies.getTotalCustomerCount, {});
	const subscriptionQuery = useQuery(api.subscriptions.getSubscription, {});

	const subscription = $derived(subscriptionQuery.data ?? { plan: 'free', status: 'active' });
	const isLoadingSubscription = $derived(!subscriptionQuery.data && !subscriptionQuery.error);

	const isPro = $derived(subscription?.plan === 'pro' && subscription?.status === 'active');
	const customerUsage = $derived(customerCount.data ?? 0);
	const usagePercentage = $derived(Math.min((customerUsage / FREE_CUSTOMER_LIMIT) * 100, 100));
	const isNearLimit = $derived(!isPro && customerUsage >= FREE_CUSTOMER_LIMIT - 3);
	const isAtLimit = $derived(!isPro && customerUsage >= FREE_CUSTOMER_LIMIT);

	const upgradeAction = action(async (_: void) => {
		const response = await fetch('/api/stripe/checkout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				priceId: PRO_PRICE_ID,
				successUrl: `${window.location.origin}/app/account/billing?success=true`,
				cancelUrl: `${window.location.origin}/app/account/billing?canceled=true`,
			}),
		});

		const data = await response.json();

		if (data.error) {
			toast.error(data.error || 'Fehler beim Upgrade');
			return;
		}

		if (data.url) {
			window.location.href = data.url;
		}
	}, 'Fehler beim Upgrade');

	const manageAction = action(async (_: void) => {
		toast.info('Bitte kontaktiere uns unter support@lazybill.app um dein Abo zu verwalten.');
	}, 'Fehler beim Öffnen des Kundenportals');

	$effect(() => {
		const params = new URLSearchParams(window.location.search);
		if (params.get('success') === 'true') {
			toast.success('Willkommen bei LazyBill Pro! 🎉');
			window.history.replaceState({}, '', '/app/account/billing');
		}
		if (params.get('canceled') === 'true') {
			toast.info('Upgrade abgebrochen');
			window.history.replaceState({}, '', '/app/account/billing');
		}
	});
</script>

<Path href="/app/account/billing" label="Abrechnung" />

<SiteHeader>Abrechnung</SiteHeader>

<div class="flex max-w-4xl flex-col gap-6">
	<!-- Current Plan Card -->
	<Card.Root class={isPro ? 'border-amber-500/50 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20' : ''}>
		<Card.Header>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					{#if isPro}
						<div class="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
							<CrownIcon class="size-6 text-white" />
						</div>
					{:else}
						<div class="flex size-12 items-center justify-center rounded-xl bg-muted">
							<ZapIcon class="size-6 text-muted-foreground" />
						</div>
					{/if}
					<div>
						<Card.Title class="flex items-center gap-2">
							{isPro ? 'LazyBill Pro' : 'LazyBill Free'}
							{#if isPro}
								<Badge class="bg-gradient-to-r from-amber-400 to-orange-500 text-white">
									PRO
								</Badge>
							{/if}
						</Card.Title>
						<Card.Description>
							{isPro ? 'Unbegrenzte Kunden und alle Funktionen' : 'Kostenlos für bis zu 15 Kunden'}
						</Card.Description>
					</div>
				</div>
				{#if isLoadingSubscription}
					<Spinner class="size-5" />
				{/if}
			</div>
		</Card.Header>
		<Card.Content>
			{#if !isPro}
				<!-- Usage Bar -->
				<div class="space-y-2">
					<div class="flex items-center justify-between text-sm">
						<span class="flex items-center gap-2">
							<UsersIcon class="size-4" />
							Kunden
						</span>
						<span class={isAtLimit ? 'font-medium text-red-600' : isNearLimit ? 'font-medium text-amber-600' : ''}>
							{customerUsage} / {FREE_CUSTOMER_LIMIT}
						</span>
					</div>
					<div class="h-2 overflow-hidden rounded-full bg-muted">
						<div
							class="h-full rounded-full transition-all duration-500 {isAtLimit
								? 'bg-red-500'
								: isNearLimit
									? 'bg-amber-500'
									: 'bg-primary'}"
							style="width: {usagePercentage}%"
						></div>
					</div>
					{#if isAtLimit}
						<p class="text-sm text-red-600">
							Du hast das Kundenlimit erreicht. Upgrade auf Pro für unbegrenzte Kunden.
						</p>
					{:else if isNearLimit}
						<p class="text-sm text-amber-600">
							Du bist fast am Limit. Upgrade auf Pro für unbegrenzte Kunden.
						</p>
					{/if}
				</div>
			{:else}
				<div class="flex items-center gap-2 text-sm text-muted-foreground">
					<UsersIcon class="size-4" />
					<span>{customerUsage} Kunden</span>
					<span class="text-green-600">• Unbegrenzt</span>
				</div>
			{#if subscription?.currentPeriodEnd}
				<p class="mt-2 text-sm text-muted-foreground">
					Nächste Abrechnung: {new Date(subscription.currentPeriodEnd).toLocaleDateString('de-DE', {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})}
				</p>
			{/if}
			{/if}
		</Card.Content>
		{#if isPro}
			<Card.Footer>
				<Button
					variant="outline"
					onclick={() => manageAction.run(undefined)}
					disabled={manageAction.isLoading}
				>
					{#if manageAction.isLoading}
						<Spinner class="size-4" />
					{/if}
					Abonnement verwalten
				</Button>
			</Card.Footer>
		{/if}
	</Card.Root>

	{#if !isPro}
		<!-- Upgrade Card -->
		<Card.Root class="relative overflow-hidden border-2 border-amber-500/50">
			<div class="absolute -right-20 -top-20 size-40 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 blur-3xl"></div>
			<Card.Header>
				<div class="flex items-center gap-3">
					<div class="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
						<SparklesIcon class="size-6 text-white" />
					</div>
					<div>
						<Card.Title>Upgrade auf Pro</Card.Title>
						<Card.Description>Alle Limits aufheben</Card.Description>
					</div>
				</div>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="flex items-baseline gap-1">
					<span class="text-4xl font-bold">10€</span>
					<span class="text-muted-foreground">/ Monat</span>
				</div>

				<Separator />

				<ul class="space-y-3">
					<li class="flex items-center gap-3">
						<div class="flex size-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
							<CheckIcon class="size-3 text-green-600 dark:text-green-400" />
						</div>
						<span>Unbegrenzte Kunden</span>
					</li>
					<li class="flex items-center gap-3">
						<div class="flex size-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
							<CheckIcon class="size-3 text-green-600 dark:text-green-400" />
						</div>
						<span>Unbegrenzte Rechnungen</span>
					</li>
					<li class="flex items-center gap-3">
						<div class="flex size-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
							<CheckIcon class="size-3 text-green-600 dark:text-green-400" />
						</div>
						<span>Unbegrenzte Firmen</span>
					</li>
					<li class="flex items-center gap-3">
						<div class="flex size-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
							<CheckIcon class="size-3 text-green-600 dark:text-green-400" />
						</div>
						<span>Prioritäts-Support</span>
					</li>
				</ul>
			</Card.Content>
			<Card.Footer>
				<Button
					class="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
					size="lg"
					onclick={() => upgradeAction.run(undefined)}
					disabled={upgradeAction.isLoading}
				>
					{#if upgradeAction.isLoading}
						<Spinner class="size-4" />
					{:else}
						<SparklesIcon class="size-4" />
					{/if}
					Jetzt auf Pro upgraden
				</Button>
			</Card.Footer>
		</Card.Root>
	{/if}

	<!-- FAQ Section -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Häufige Fragen</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div>
				<h4 class="font-medium">Was passiert mit meinen Daten, wenn ich upgrade?</h4>
				<p class="text-sm text-muted-foreground">
					Alle deine Daten bleiben erhalten. Du bekommst einfach Zugriff auf mehr Funktionen.
				</p>
			</div>
			<Separator />
			<div>
				<h4 class="font-medium">Kann ich jederzeit kündigen?</h4>
				<p class="text-sm text-muted-foreground">
					Ja, du kannst dein Abonnement jederzeit kündigen. Du behältst den Zugang bis zum Ende
					des Abrechnungszeitraums.
				</p>
			</div>
			<Separator />
			<div>
				<h4 class="font-medium">Was passiert, wenn ich das Kundenlimit erreiche?</h4>
				<p class="text-sm text-muted-foreground">
					Du kannst weiterhin mit deinen bestehenden Kunden arbeiten, aber keine neuen hinzufügen,
					bis du upgradest oder Kunden archivierst.
				</p>
			</div>
		</Card.Content>
	</Card.Root>
</div>
