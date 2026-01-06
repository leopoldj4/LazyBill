<script lang="ts">
	import { isEmpty, type Address } from '$lib/address';
	import { cn } from '$lib/utils';

	type Props = {
		address: Address;
		class?: string;
	};

	let { address, class: className }: Props = $props();
</script>

{#if isEmpty(address)}
	<p class={cn("text-gray-500", className)}>Keine Adresse</p>
{:else}
	<p class={className}>
		{address.street}<br />
		{address.zip} {address.city}<br />
		{address.state}{#if address.state && address.country}{", "}{/if}{address.country}
	</p>
{/if}
