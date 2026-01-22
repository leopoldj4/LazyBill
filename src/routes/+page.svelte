<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import QrCodeIcon from '@lucide/svelte/icons/qr-code';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import UsersIcon from '@lucide/svelte/icons/users';
	import ZapIcon from '@lucide/svelte/icons/zap';

	import Logo from '$lib/assets/logo.svg';
	import BetaBadge from '$lib/components/BetaBadge.svelte';
	import { Button } from '$lib/components/ui/button';

	const highlights = [
		'DIN 5008-ready invoices for German customers',
		'SEPA QR codes that speed up payments',
		'Realtime sync powered by Convex',
	];

	const features = [
		{
			title: 'Invoices built for Germany',
			description:
				'Generate compliant layouts in seconds with German standards baked into every document.',
			icon: FileTextIcon,
		},
		{
			title: 'Live PDF previews',
			description:
				'Edit once and watch the Typst-powered invoice preview update instantly in your browser.',
			icon: SparklesIcon,
		},
		{
			title: 'SEPA QR codes',
			description: 'Embed GiroCode/EPC-QR directly on invoices so clients can pay in seconds.',
			icon: QrCodeIcon,
		},
		{
			title: 'Customers and companies in one place',
			description: 'Store profiles, addresses, and billing history together for quick access.',
			icon: UsersIcon,
		},
		{
			title: 'Tasks and time tracking',
			description: 'Keep track of work next to invoices with built-in tasks and timers.',
			icon: ClockIcon,
		},
		{
			title: 'Realtime by default',
			description: 'Every update syncs live across devices so your team always stays aligned.',
			icon: ZapIcon,
		},
	];

	const steps = [
		{
			title: 'Set up your company once',
			description: 'Add business details, branding, and invoice defaults in minutes.',
		},
		{
			title: 'Create and send invoices fast',
			description: 'Build invoices from customers and time entries with live previews.',
		},
		{
			title: 'Get paid with less chasing',
			description: 'SEPA QR codes and clear summaries make payment friction-free.',
		},
	];
</script>

<svelte:head>
	<title>LazyBill - Realtime invoicing for modern freelancers</title>
	<meta
		name="description"
		content="LazyBill is a realtime invoicing and business management workspace for freelancers and small teams. Create DIN 5008 invoices with live PDF previews, track time, and get paid faster with SEPA QR codes."
	/>
</svelte:head>

<div class="relative overflow-hidden bg-background">
	<div class="absolute inset-0 -z-10 bg-linear-to-b from-primary/10 via-transparent to-transparent"></div>
	<div class="absolute -top-32 right-0 -z-10 h-80 w-80 rounded-full bg-primary/15 blur-3xl"></div>
	<div class="absolute top-40 -left-24 -z-10 h-72 w-72 rounded-full bg-indigo-400/15 blur-3xl"></div>

	<header class="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-8">
		<a href="/" class="flex items-center gap-3">
			<img src={Logo} alt="LazyBill logo" class="size-10 rounded-xl border border-border bg-white p-1" />
			<span class="text-lg font-semibold">LazyBill</span>
			<BetaBadge />
		</a>
		<nav class="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
			<a href="#features" class="transition hover:text-foreground">Features</a>
			<a href="#workflow" class="transition hover:text-foreground">Workflow</a>
			<a href="#cta" class="transition hover:text-foreground">Get started</a>
		</nav>
		<div class="flex items-center gap-4">
			<a href="/login" class="text-sm font-medium text-muted-foreground transition hover:text-foreground">
				Log in
			</a>
			<Button href="/sign-up" size="sm" class="gap-2">
				Start beta
				<ArrowRightIcon class="size-4" />
			</Button>
		</div>
	</header>

	<main class="mx-auto w-full max-w-6xl px-6 pb-24 pt-16">
		<section class="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
			<div>
				<div
					class="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs text-muted-foreground shadow-xs"
				>
					<SparklesIcon class="size-3 text-primary" />
					Realtime invoicing, built for Germany.
				</div>
				<h1 class="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
					Ship invoices faster. Track work without the spreadsheets.
				</h1>
				<p class="mt-4 text-lg text-muted-foreground">
					LazyBill is the modern workspace for freelancers and small businesses who want to
					send DIN 5008 invoices, manage customers, and track time with live updates.
				</p>
				<div class="mt-8 flex flex-wrap gap-4">
					<Button href="/sign-up" size="lg" class="gap-2">
						Get started
						<ArrowRightIcon class="size-4" />
					</Button>
					<Button href="/login" variant="outline" size="lg">
						See the app
					</Button>
				</div>
				<div class="mt-10 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
					{#each highlights as item}
						<div class="flex items-center gap-2">
							<CheckIcon class="size-4 text-primary" />
							<span>{item}</span>
						</div>
					{/each}
				</div>
			</div>
			<div class="relative">
				<div class="rounded-3xl border border-border bg-card/90 p-6 shadow-lg backdrop-blur">
					<div class="flex items-center justify-between text-xs text-muted-foreground">
						<div class="flex items-center gap-2">
							<span class="size-2 rounded-full bg-emerald-500"></span>
							Live invoice preview
						</div>
						<span>Updated now</span>
					</div>
					<div class="mt-6 space-y-4">
						<div class="space-y-2">
							<div class="h-3 w-32 rounded-full bg-muted"></div>
							<div class="h-2 w-48 rounded-full bg-muted/70"></div>
						</div>
						<div class="rounded-2xl border border-border bg-background p-4">
							<div class="flex items-center justify-between">
								<span class="text-sm font-semibold">Invoice #LB-2026-01</span>
								<span class="text-xs font-medium text-emerald-600">Open</span>
							</div>
							<div class="mt-3 space-y-2">
								<div class="h-2 w-full rounded-full bg-muted"></div>
								<div class="h-2 w-5/6 rounded-full bg-muted"></div>
								<div class="h-2 w-2/3 rounded-full bg-muted"></div>
							</div>
							<div class="mt-4 flex items-center justify-between text-xs text-muted-foreground">
								<span>SEPA QR included</span>
								<div class="size-9 rounded-md border border-border bg-muted/40"></div>
							</div>
						</div>
						<div class="grid gap-3 sm:grid-cols-2">
							<div class="rounded-xl border border-border bg-background p-3">
								<div class="text-xs text-muted-foreground">This month</div>
								<div class="mt-2 text-lg font-semibold">EUR 8,420</div>
								<div class="text-xs text-muted-foreground">Paid invoices</div>
							</div>
							<div class="rounded-xl border border-border bg-background p-3">
								<div class="text-xs text-muted-foreground">Time tracked</div>
								<div class="mt-2 text-lg font-semibold">41h 30m</div>
								<div class="text-xs text-muted-foreground">Ready to bill</div>
							</div>
						</div>
					</div>
				</div>
				<div
					class="absolute -bottom-10 -right-6 w-[80%] rounded-3xl border border-border bg-background p-4 shadow-xl"
				>
					<div class="flex items-center justify-between text-xs text-muted-foreground">
						<span>Today</span>
						<span class="font-medium text-foreground">3h 15m tracked</span>
					</div>
					<div class="mt-3 flex items-center gap-3">
						<div
							class="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary"
						>
							<ClockIcon class="size-5" />
						</div>
						<div>
							<div class="text-sm font-medium">Design sprint</div>
							<div class="text-xs text-muted-foreground">Time stays linked to invoices.</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section id="features" class="mt-24">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p class="text-sm font-semibold uppercase tracking-[0.2em] text-primary">USPs</p>
					<h2 class="mt-3 text-3xl font-semibold">Everything you need to bill with confidence</h2>
				</div>
				<p class="max-w-md text-sm text-muted-foreground">
					LazyBill blends invoicing, client management, and tracking into one realtime
					workspace, so you can stay focused on the work that matters.
				</p>
			</div>
			<div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each features as feature}
					<div
						class="group rounded-3xl border border-border bg-card/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
					>
						<div class="flex items-center gap-3">
							<div
								class="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground"
							>
								<svelte:component this={feature.icon} class="size-5" />
							</div>
							<h3 class="text-lg font-semibold">{feature.title}</h3>
						</div>
						<p class="mt-3 text-sm text-muted-foreground">{feature.description}</p>
					</div>
				{/each}
			</div>
		</section>

		<section id="workflow" class="mt-24 grid gap-12 lg:grid-cols-[0.6fr_0.4fr]">
			<div>
				<p class="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Workflow</p>
				<h2 class="mt-3 text-3xl font-semibold">From first client to paid invoice</h2>
				<p class="mt-4 text-muted-foreground">
					Build a clean billing flow that keeps your customers, tasks, and time entries in
					one place. LazyBill keeps everything synced so you can move fast.
				</p>
				<div class="mt-8 grid gap-6 md:grid-cols-3">
					{#each steps as step, index}
						<div class="rounded-3xl border border-border bg-background p-6 shadow-sm">
							<div class="flex items-center gap-3">
								<span
									class="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
								>
									{index + 1}
								</span>
								<h3 class="text-base font-semibold">{step.title}</h3>
							</div>
							<p class="mt-3 text-sm text-muted-foreground">{step.description}</p>
						</div>
					{/each}
				</div>
			</div>
			<div class="rounded-3xl border border-border bg-card/90 p-8 shadow-sm">
				<h3 class="text-xl font-semibold">Why teams stick with LazyBill</h3>
				<ul class="mt-6 space-y-4 text-sm text-muted-foreground">
					<li class="flex items-start gap-3">
						<CheckIcon class="mt-0.5 size-4 text-primary" />
						<span>Realtime data sync means no manual refreshes or stale invoices.</span>
					</li>
					<li class="flex items-start gap-3">
						<CheckIcon class="mt-0.5 size-4 text-primary" />
						<span>Modern authentication keeps every company workspace isolated and secure.</span>
					</li>
					<li class="flex items-start gap-3">
						<CheckIcon class="mt-0.5 size-4 text-primary" />
						<span>Installable PWA so you can work on desktop or mobile with ease.</span>
					</li>
				</ul>
				<div class="mt-8 rounded-2xl border border-border bg-background p-4">
					<div class="text-xs text-muted-foreground">Realtime status</div>
					<div class="mt-2 flex items-center gap-2 text-sm font-semibold">
						<span class="size-2 rounded-full bg-emerald-500"></span>
						Connected and syncing
					</div>
				</div>
			</div>
		</section>

		<section
			id="cta"
			class="mt-24 rounded-[32px] border border-border bg-linear-to-br from-primary/10 via-background to-background p-10 shadow-lg sm:p-14"
		>
			<div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
				<div>
					<p class="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
						Ready to start?
					</p>
					<h2 class="mt-3 text-3xl font-semibold">Move your invoicing into the fast lane.</h2>
					<p class="mt-4 text-muted-foreground">
						Join the beta and experience realtime invoicing tailored to German freelancers and
						teams.
					</p>
				</div>
				<div class="flex flex-wrap gap-4">
					<Button href="/sign-up" size="lg" class="gap-2">
						Join the beta
						<ArrowRightIcon class="size-4" />
					</Button>
					<Button href="/login" variant="outline" size="lg">
						Log in
					</Button>
				</div>
			</div>
		</section>
	</main>

	<footer class="border-t border-border py-10">
		<div class="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
			<div class="flex items-center gap-3">
				<img src={Logo} alt="LazyBill" class="size-8" />
				<span>LazyBill</span>
			</div>
			<div class="flex flex-wrap items-center gap-4">
				<a href="#features" class="transition hover:text-foreground">Features</a>
				<a href="#workflow" class="transition hover:text-foreground">Workflow</a>
				<a href="/login" class="transition hover:text-foreground">Log in</a>
				<a href="/sign-up" class="transition hover:text-foreground">Get started</a>
			</div>
			<div>&copy; 2025 LazyBill. All rights reserved.</div>
		</div>
	</footer>
</div>
