<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Icon as IconType } from '@lucide/svelte';

	let {
		children,
		href,
		icon: Icon,
	}: {
		children: Snippet;
		href: string;
		icon: typeof IconType;
	} = $props();
</script>

<a {href} class="flex flex-row items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-sm">
	<Icon class="size-4" />
	{@render children?.()}
</a>
