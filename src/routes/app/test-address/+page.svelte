<script lang="ts">
	import AddressInput, { type ParsedAddress } from '$lib/components/AddressInput.svelte';

	let selectedAddress: ParsedAddress | null = $state(null);

	function handleAddressSelect(address: ParsedAddress) {
		console.log('Address selected:', address);
	}
</script>

<div class="mx-auto max-w-4xl w-full space-y-8 p-8">
	<div>
		<h1 class="text-2xl font-bold">Address Input Test</h1>
		<p class="text-muted-foreground mt-1">Test the address autocomplete component</p>
	</div>

	<div class="space-y-4">
		<span class="text-sm font-medium">Adresse</span>
		<AddressInput
			bind:selectedAddress
			onAddressSelect={handleAddressSelect}
			placeholder="z.B. Musterstraße 1, Berlin"
		/>
	</div>

	{#if selectedAddress}
		<div class="rounded-lg border p-4">
			<h2 class="mb-4 font-semibold">Parsed Address Data</h2>
			<div class="grid grid-cols-2 gap-3 text-sm">
				<div>
					<span class="text-muted-foreground">Street:</span>
					<span class="ml-2 font-mono">{selectedAddress.street || '–'}</span>
				</div>
				<div>
					<span class="text-muted-foreground">House Number:</span>
					<span class="ml-2 font-mono">{selectedAddress.houseNumber || '–'}</span>
				</div>
				<div>
					<span class="text-muted-foreground">Postal Code:</span>
					<span class="ml-2 font-mono">{selectedAddress.postalCode || '–'}</span>
				</div>
				<div>
					<span class="text-muted-foreground">City:</span>
					<span class="ml-2 font-mono">{selectedAddress.city || '–'}</span>
				</div>
				<div>
					<span class="text-muted-foreground">District:</span>
					<span class="ml-2 font-mono">{selectedAddress.district || '–'}</span>
				</div>
				<div>
					<span class="text-muted-foreground">State:</span>
					<span class="ml-2 font-mono">{selectedAddress.state || '–'}</span>
				</div>
				<div>
					<span class="text-muted-foreground">Country:</span>
					<span class="ml-2 font-mono">{selectedAddress.country || '–'}</span>
				</div>
				<div>
					<span class="text-muted-foreground">Coordinates:</span>
					<span class="ml-2 font-mono">{selectedAddress.lat}, {selectedAddress.lon}</span>
				</div>
				<div class="col-span-2">
					<span class="text-muted-foreground">Full Display Name:</span>
					<p class="mt-1 font-mono text-xs break-all">{selectedAddress.displayName}</p>
				</div>
			</div>
		</div>
	{/if}
</div>
