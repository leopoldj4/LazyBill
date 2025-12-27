<script lang="ts">
	import { isEmpty, type Address } from '$lib/address';

	type Props = {
		address: Address;
	};

	let { address }: Props = $props();
</script>

{#if isEmpty(address)}
	<p class="text-gray-500">Keine Adresse</p>
{:else}
	<p>
		{address.street}<br />
		{address.zip} {address.city}<br />
		{address.state}{#if address.state && address.country}{", "}{/if}{address.country}
	</p>
{/if}
