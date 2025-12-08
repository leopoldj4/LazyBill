<script lang="ts">
	import { z } from 'zod';
	import * as Command from '$lib/components/ui/command';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import LoaderIcon from '@lucide/svelte/icons/loader';
	import { cn } from '$lib/utils.js';

	// Zod schema for Nominatim API response
	const NominatimResultSchema = z.object({
		place_id: z.number(),
		licence: z.string(),
		osm_type: z.string(),
		osm_id: z.number(),
		lat: z.string(),
		lon: z.string(),
		category: z.string(),
		type: z.string(),
		place_rank: z.number(),
		importance: z.number(),
		addresstype: z.string(),
		name: z.string(),
		display_name: z.string(),
		boundingbox: z.array(z.string())
	});

	const NominatimResponseSchema = z.array(NominatimResultSchema);

	type NominatimResult = z.infer<typeof NominatimResultSchema>;

	// Parsed address structure
	export interface ParsedAddress {
		street: string;
		houseNumber: string;
		city: string;
		district: string;
		state: string;
		postalCode: string;
		country: string;
		lat: string;
		lon: string;
		displayName: string;
	}

	type Props = {
		class?: string;
		placeholder?: string;
		selectedAddress?: ParsedAddress | null;
		onAddressSelect?: (address: ParsedAddress) => void;
	};

	let {
		class: className,
		placeholder = 'Adresse eingeben...',
		selectedAddress = $bindable(null),
		onAddressSelect
	}: Props = $props();

	let inputValue = $state('');
	let results = $state<NominatimResult[]>([]);
	let isLoading = $state(false);
	let isOpen = $state(false);
	let debounceTimer = $state<ReturnType<typeof setTimeout> | null>(null);
	let hasSearched = $state(false);
	let isTyping = $state(false);

	// Show loader when typing (debouncing) or fetching
	let showLoader = $derived(isTyping || isLoading);

	// Parse display_name into structured address
	function parseAddress(result: NominatimResult): ParsedAddress {
		const parts = result.display_name.split(', ').map((p) => p.trim());

		// German address format typically:
		// "HouseNumber, Street, District, City, State, PostalCode, Country"
		// or "Street, District, City, State, PostalCode, Country"

		let houseNumber = '';
		let street = '';
		let district = '';
		let city = '';
		let state = '';
		let postalCode = '';
		let country = '';

		if (parts.length >= 1) {
			// Check if first part is a number (house number)
			if (/^\d+[a-zA-Z]?$/.test(parts[0])) {
				houseNumber = parts[0];
				street = parts[1] || '';
			} else {
				street = parts[0];
			}
		}

		// Find postal code (5 digits in Germany)
		const postalIndex = parts.findIndex((p) => /^\d{5}$/.test(p));
		if (postalIndex !== -1) {
			postalCode = parts[postalIndex];
			// Country is usually after postal code
			if (postalIndex + 1 < parts.length) {
				country = parts[postalIndex + 1];
			}
			// State is usually before postal code
			if (postalIndex - 1 >= 0) {
				state = parts[postalIndex - 1];
			}
			// City is usually 2 positions before postal code
			if (postalIndex - 2 >= 0) {
				city = parts[postalIndex - 2];
			}
			// District is in between street and city
			const startIdx = houseNumber ? 2 : 1;
			const endIdx = postalIndex - 2;
			if (endIdx > startIdx) {
				district = parts.slice(startIdx, endIdx).join(', ');
			}
		}

		return {
			houseNumber,
			street,
			district,
			city,
			state,
			postalCode,
			country,
			lat: result.lat,
			lon: result.lon,
			displayName: result.display_name
		};
	}

	// Fetch addresses from Nominatim API
	async function fetchAddresses(query: string) {
		if (!query || query.length < 3) {
			results = [];
			hasSearched = false;
			return;
		}

		isLoading = true;
		hasSearched = true;

		try {
			const params = new URLSearchParams({
				q: query,
				countrycodes: 'de',
				format: 'jsonv2'
			});

			const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
				headers: {
					'User-Agent': 'Tempora/1.0'
				}
			});

			if (!response.ok) {
				throw new Error('API request failed');
			}

			const data = await response.json();
			const parsed = NominatimResponseSchema.safeParse(data);

			if (parsed.success) {
				results = parsed.data;
			} else {
				console.error('Validation error:', parsed.error);
				results = [];
			}
		} catch (error) {
			console.error('Failed to fetch addresses:', error);
			results = [];
		} finally {
			isLoading = false;
		}
	}

	// Debounced input handler
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		inputValue = target.value;

		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}

		if (inputValue.length >= 3) {
			isOpen = true;
			isTyping = true;
			debounceTimer = setTimeout(() => {
				isTyping = false;
				fetchAddresses(inputValue);
			}, 1000);
		} else {
			results = [];
			hasSearched = false;
			isOpen = false;
			isTyping = false;
		}
	}

	// Handle address selection
	function selectAddress(result: NominatimResult) {
		const parsed = parseAddress(result);
		selectedAddress = parsed;
		isOpen = false;
		onAddressSelect?.(parsed);
	}

	// Format summary for display
	function formatSummary(address: ParsedAddress): string {
		const parts = [];
		if (address.street) {
			parts.push(address.houseNumber ? `${address.street} ${address.houseNumber}` : address.street);
		}
		if (address.postalCode && address.city) {
			parts.push(`${address.postalCode} ${address.city}`);
		} else if (address.city) {
			parts.push(address.city);
		}
		return parts.join(', ');
	}

	// Handle focus
	function handleFocus() {
		if (results.length > 0 || (inputValue.length >= 3 && hasSearched)) {
			isOpen = true;
		}
	}

	// Handle blur with delay to allow click on items
	function handleBlur() {
		setTimeout(() => {
			isOpen = false;
		}, 200);
	}
</script>

<div class={cn('relative w-full', className)}>
	<div class="relative">
		<Command.Root class="overflow-visible rounded-md border shadow-xs" shouldFilter={false}>
			<div class="flex h-9 items-center gap-2 border-b-0 px-3">
				<MapPinIcon class="size-4 shrink-0 opacity-50" />
				<input
					type="text"
					class="placeholder:text-muted-foreground flex h-9 w-full bg-transparent py-1 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
					{placeholder}
					value={inputValue}
					oninput={handleInput}
					onfocus={handleFocus}
					onblur={handleBlur}
					autocomplete="off"
				/>
				{#if showLoader}
					<LoaderIcon class="size-4 shrink-0 animate-spin opacity-50" />
				{/if}
			</div>

			{#if isOpen}
				<Command.List
					class="bg-popover absolute top-full right-0 left-0 z-50 mt-1 max-h-[300px] overflow-y-auto rounded-md border shadow-md"
				>
				{#if showLoader}
					<div class="text-muted-foreground py-6 text-center text-sm">Suche...</div>
				{:else if results.length === 0 && hasSearched}
						<Command.Empty>Keine Ergebnisse gefunden.</Command.Empty>
					{:else}
						<Command.Group>
							{#each results as result (result.place_id)}
								<Command.Item
									value={String(result.place_id)}
									onSelect={() => selectAddress(result)}
									class="cursor-pointer"
								>
									<MapPinIcon class="text-muted-foreground mr-2 size-4" />
									<span class="truncate">{result.display_name}</span>
								</Command.Item>
							{/each}
						</Command.Group>
					{/if}
				</Command.List>
			{/if}
		</Command.Root>
	</div>

	{#if selectedAddress}
		<div
			class="text-muted-foreground mt-2 flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm"
		>
			<MapPinIcon class="size-4 shrink-0" />
			<span>{formatSummary(selectedAddress)}</span>
		</div>
	{/if}
</div>

