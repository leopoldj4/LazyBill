<script lang="ts">
	import { goto } from '$app/navigation';
	import BetaBadge from '$lib/components/BetaBadge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import QrCodeIcon from '@lucide/svelte/icons/qr-code';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import ShieldCheckIcon from '@lucide/svelte/icons/shield-check';
	import UsersIcon from '@lucide/svelte/icons/users';
	import ZapIcon from '@lucide/svelte/icons/zap';
</script>

<div class="min-h-screen bg-background">
	<!-- Navigation -->
	<nav class="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
		<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
			<div class="flex items-center gap-2">
				<span class="font-display text-2xl font-bold">LazyBill</span>
				<BetaBadge />
			</div>
			<div class="flex items-center gap-4">
				<Button variant="ghost" onclick={() => goto('/login')}>Anmelden</Button>
				<Button onclick={() => goto('/sign-up')}>
					Kostenlos starten
					<ArrowRightIcon class="ml-1 size-4" />
				</Button>
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<section class="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
		<!-- Background gradient -->
		<div class="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
		<div class="absolute -top-40 -right-40 -z-10 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl"></div>
		<div class="absolute -bottom-40 -left-40 -z-10 h-[400px] w-[400px] rounded-full bg-chart-3/10 blur-3xl"></div>

		<div class="mx-auto max-w-6xl px-6">
			<div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
				<div class="flex flex-col gap-8">
					<div class="flex flex-col gap-6">
						<div class="inline-flex w-fit items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
							<span class="relative flex size-2">
								<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
								<span class="relative inline-flex size-2 rounded-full bg-primary"></span>
							</span>
							Jetzt in der Beta verfügbar
						</div>
						<h1 class="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
							Rechnungen erstellen,
							<span class="bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
								ohne den Aufwand
							</span>
						</h1>
						<p class="max-w-lg text-lg text-muted-foreground lg:text-xl">
							Die moderne Lösung für Freelancer und Kleinunternehmer. Erstelle professionelle Rechnungen nach DIN 5008
							– in Sekunden, nicht Stunden.
						</p>
					</div>

					<div class="flex flex-col gap-4 sm:flex-row">
						<Button size="lg" class="text-base" onclick={() => goto('/sign-up')}>
							Kostenlos starten
							<ArrowRightIcon class="ml-2 size-4" />
						</Button>
						<Button size="lg" variant="outline" class="text-base" onclick={() => goto('/login')}>
							Anmelden
						</Button>
					</div>

					<div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
						<div class="flex items-center gap-2">
							<CheckIcon class="size-4 text-primary" />
							<span>Kostenlos in der Beta</span>
						</div>
						<div class="flex items-center gap-2">
							<CheckIcon class="size-4 text-primary" />
							<span>Keine Kreditkarte nötig</span>
						</div>
						<div class="flex items-center gap-2">
							<CheckIcon class="size-4 text-primary" />
							<span>DSGVO-konform</span>
						</div>
					</div>
				</div>

				<!-- Invoice Preview Mockup -->
				<div class="relative">
					<div class="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-r from-primary/20 to-chart-3/20 blur-2xl"></div>
					<div class="overflow-hidden rounded-xl border bg-card shadow-2xl">
						<!-- Window Header -->
						<div class="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
							<div class="flex gap-1.5">
								<div class="size-3 rounded-full bg-red-400"></div>
								<div class="size-3 rounded-full bg-yellow-400"></div>
								<div class="size-3 rounded-full bg-green-400"></div>
							</div>
							<span class="ml-2 text-xs text-muted-foreground">Rechnung #2024-001</span>
						</div>
						<!-- Invoice Content -->
						<div class="p-6 text-sm">
							<div class="mb-6 flex items-start justify-between">
								<div>
									<div class="font-display text-lg font-semibold">Musterfirma GmbH</div>
									<div class="text-muted-foreground">Musterstraße 1</div>
									<div class="text-muted-foreground">12345 Berlin</div>
								</div>
								<div class="text-right">
									<div class="text-xs text-muted-foreground">Rechnungsdatum</div>
									<div class="font-medium">22.01.2026</div>
								</div>
							</div>

							<div class="mb-6 rounded-lg bg-muted/30 p-4">
								<div class="text-xs text-muted-foreground">Empfänger</div>
								<div class="font-medium">Kunde AG</div>
								<div class="text-muted-foreground">Kundenweg 42, 54321 Hamburg</div>
							</div>

							<table class="mb-6 w-full text-left">
								<thead>
									<tr class="border-b text-xs text-muted-foreground">
										<th class="pb-2 font-medium">Beschreibung</th>
										<th class="pb-2 text-right font-medium">Betrag</th>
									</tr>
								</thead>
								<tbody>
									<tr class="border-b">
										<td class="py-3">Webdesign & Entwicklung</td>
										<td class="py-3 text-right">2.400,00 €</td>
									</tr>
									<tr class="border-b">
										<td class="py-3">SEO-Optimierung</td>
										<td class="py-3 text-right">600,00 €</td>
									</tr>
								</tbody>
							</table>

							<div class="flex items-end justify-between">
								<div class="flex size-16 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30">
									<QrCodeIcon class="size-8 text-muted-foreground/50" />
								</div>
								<div class="text-right">
									<div class="text-xs text-muted-foreground">Gesamtsumme</div>
									<div class="font-display text-2xl font-bold">3.000,00 €</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="border-t bg-muted/30 py-20 lg:py-32">
		<div class="mx-auto max-w-6xl px-6">
			<div class="mb-16 text-center">
				<h2 class="font-display text-3xl font-bold tracking-tight sm:text-4xl">
					Alles, was du brauchst. Nichts, was du nicht brauchst.
				</h2>
				<p class="mt-4 text-lg text-muted-foreground">
					LazyBill wurde für deutsche Freelancer und Kleinunternehmer entwickelt.
				</p>
			</div>

			<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
				<!-- Feature 1 -->
				<div class="group relative rounded-xl border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg">
					<div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
						<ZapIcon class="size-6" />
					</div>
					<h3 class="font-display text-xl font-semibold">Sofortige PDF-Erstellung</h3>
					<p class="mt-2 text-muted-foreground">
						Generiere professionelle PDFs direkt im Browser. Keine Wartezeit, keine Server-Verarbeitung.
					</p>
				</div>

				<!-- Feature 2 -->
				<div class="group relative rounded-xl border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg">
					<div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
						<FileTextIcon class="size-6" />
					</div>
					<h3 class="font-display text-xl font-semibold">DIN 5008 Standard</h3>
					<p class="mt-2 text-muted-foreground">
						Alle Rechnungen entsprechen dem deutschen Geschäftsbrief-Standard. Professionell und normgerecht.
					</p>
				</div>

				<!-- Feature 3 -->
				<div class="group relative rounded-xl border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg">
					<div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
						<QrCodeIcon class="size-6" />
					</div>
					<h3 class="font-display text-xl font-semibold">SEPA QR-Codes</h3>
					<p class="mt-2 text-muted-foreground">
						Integrierte GiroCode/EPC-QR-Codes ermöglichen deinen Kunden die Zahlung mit einem Scan.
					</p>
				</div>

				<!-- Feature 4 -->
				<div class="group relative rounded-xl border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg">
					<div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
						<RefreshCwIcon class="size-6" />
					</div>
					<h3 class="font-display text-xl font-semibold">Echtzeit-Synchronisation</h3>
					<p class="mt-2 text-muted-foreground">
						Deine Daten sind immer aktuell – auf jedem Gerät. Keine manuelle Synchronisation nötig.
					</p>
				</div>

				<!-- Feature 5 -->
				<div class="group relative rounded-xl border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg">
					<div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
						<UsersIcon class="size-6" />
					</div>
					<h3 class="font-display text-xl font-semibold">Kundenverwaltung</h3>
					<p class="mt-2 text-muted-foreground">
						Verwalte alle deine Kunden an einem Ort. Adressen, Kontaktdaten und Rechnungshistorie.
					</p>
				</div>

				<!-- Feature 6 -->
				<div class="group relative rounded-xl border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg">
					<div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
						<ClockIcon class="size-6" />
					</div>
					<h3 class="font-display text-xl font-semibold">Zeiterfassung</h3>
					<p class="mt-2 text-muted-foreground">
						Tracke deine Arbeitszeit mit einem Klick. Wandle Zeiteinträge direkt in Rechnungspositionen um.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- USP Section -->
	<section class="py-20 lg:py-32">
		<div class="mx-auto max-w-6xl px-6">
			<div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
				<div class="order-2 lg:order-1">
					<div class="relative">
						<div class="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-br from-chart-3/20 to-primary/20 blur-2xl"></div>
						<div class="overflow-hidden rounded-xl border bg-card p-6 shadow-xl">
							<div class="mb-4 text-sm font-medium text-muted-foreground">Kleinunternehmer? Kein Problem.</div>
							<div class="space-y-3">
								<div class="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
									<CheckIcon class="size-5 text-green-500" />
									<span>§19 UStG automatisch berücksichtigt</span>
								</div>
								<div class="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
									<CheckIcon class="size-5 text-green-500" />
									<span>Keine Mehrwertsteuer-Berechnung</span>
								</div>
								<div class="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
									<CheckIcon class="size-5 text-green-500" />
									<span>Rechtssicherer Hinweis auf Rechnung</span>
								</div>
								<div class="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
									<CheckIcon class="size-5 text-green-500" />
									<span>Einfacher Wechsel bei Wachstum</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="order-1 flex flex-col gap-6 lg:order-2">
					<div class="inline-flex w-fit items-center gap-2 rounded-full bg-chart-3/10 px-3 py-1 text-sm text-chart-3">
						<ShieldCheckIcon class="size-4" />
						Für deutsche Selbstständige
					</div>
					<h2 class="font-display text-3xl font-bold tracking-tight sm:text-4xl">
						Speziell für den deutschen Markt entwickelt
					</h2>
					<p class="text-lg text-muted-foreground">
						Ob Kleinunternehmer mit Steuerbefreiung oder etabliertes Unternehmen mit Umsatzsteuer – LazyBill passt sich
						deinen Bedürfnissen an.
					</p>
					<ul class="space-y-3">
						<li class="flex items-start gap-3">
							<CheckIcon class="mt-0.5 size-5 shrink-0 text-primary" />
							<span>Automatische Mehrwertsteuer-Berechnung (7% / 19%)</span>
						</li>
						<li class="flex items-start gap-3">
							<CheckIcon class="mt-0.5 size-5 shrink-0 text-primary" />
							<span>Kleinunternehmerregelung mit einem Klick aktivieren</span>
						</li>
						<li class="flex items-start gap-3">
							<CheckIcon class="mt-0.5 size-5 shrink-0 text-primary" />
							<span>Deutsche Datumsformate und Währung</span>
						</li>
						<li class="flex items-start gap-3">
							<CheckIcon class="mt-0.5 size-5 shrink-0 text-primary" />
							<span>SEPA-Überweisungen mit GiroCode</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</section>

	<!-- How It Works -->
	<section class="border-t bg-muted/30 py-20 lg:py-32">
		<div class="mx-auto max-w-6xl px-6">
			<div class="mb-16 text-center">
				<h2 class="font-display text-3xl font-bold tracking-tight sm:text-4xl">
					In drei Schritten zur Rechnung
				</h2>
				<p class="mt-4 text-lg text-muted-foreground">
					So einfach war Rechnungsstellung noch nie.
				</p>
			</div>

			<div class="grid gap-8 lg:grid-cols-3">
				<div class="relative flex flex-col items-center text-center">
					<div class="mb-6 flex size-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
						1
					</div>
					<h3 class="font-display text-xl font-semibold">Firma einrichten</h3>
					<p class="mt-2 text-muted-foreground">
						Hinterlege einmalig deine Firmendaten, Bankverbindung und Steuernummer.
					</p>
					<div class="absolute top-8 left-[60%] hidden h-0.5 w-[80%] bg-gradient-to-r from-primary to-transparent lg:block"></div>
				</div>

				<div class="relative flex flex-col items-center text-center">
					<div class="mb-6 flex size-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
						2
					</div>
					<h3 class="font-display text-xl font-semibold">Kunden anlegen</h3>
					<p class="mt-2 text-muted-foreground">
						Speichere deine Kunden mit allen relevanten Daten. Einmal anlegen, immer wieder verwenden.
					</p>
					<div class="absolute top-8 left-[60%] hidden h-0.5 w-[80%] bg-gradient-to-r from-primary to-transparent lg:block"></div>
				</div>

				<div class="flex flex-col items-center text-center">
					<div class="mb-6 flex size-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
						3
					</div>
					<h3 class="font-display text-xl font-semibold">Rechnung erstellen</h3>
					<p class="mt-2 text-muted-foreground">
						Füge Positionen hinzu, sieh die Live-Vorschau und lade dein fertiges PDF herunter.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="relative overflow-hidden py-20 lg:py-32">
		<div class="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/5 to-primary/10"></div>
		<div class="absolute -bottom-40 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"></div>

		<div class="mx-auto max-w-3xl px-6 text-center">
			<h2 class="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
				Bereit, deine Rechnungen zu vereinfachen?
			</h2>
			<p class="mt-6 text-lg text-muted-foreground">
				Schließe dich anderen Freelancern und Kleinunternehmern an, die ihre Rechnungsstellung mit LazyBill
				revolutioniert haben.
			</p>
			<div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
				<Button size="lg" class="text-base" onclick={() => goto('/sign-up')}>
					Jetzt kostenlos starten
					<ArrowRightIcon class="ml-2 size-4" />
				</Button>
			</div>
			<p class="mt-6 text-sm text-muted-foreground">
				Kostenlos während der Beta-Phase. Keine Kreditkarte erforderlich.
			</p>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t py-12">
		<div class="mx-auto max-w-6xl px-6">
			<div class="flex flex-col items-center justify-between gap-6 sm:flex-row">
				<div class="flex items-center gap-2">
					<span class="font-display text-xl font-bold">LazyBill</span>
					<BetaBadge />
				</div>
				<div class="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
					<a href="/legal/privacy" class="hover:text-foreground transition-colors">Datenschutz</a>
					<a href="/legal/terms" class="hover:text-foreground transition-colors">AGB</a>
					<a href="/legal/imprint" class="hover:text-foreground transition-colors">Impressum</a>
				</div>
				<div class="text-sm text-muted-foreground">
					&copy; 2025 leoj.de
				</div>
			</div>
		</div>
	</footer>
</div>
