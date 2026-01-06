<script lang="ts">
	import type { Snippet } from "svelte";

	type Props = {
		title: string;
		children: Snippet;
	};

	let { title, children }: Props = $props();
</script>

<div class="grid gap-8 w-full border p-8 rounded-lg">
	<h2 class="text-xl">{title}</h2>
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8 w-full">
		{@render children?.()}
	</div>
</div>
