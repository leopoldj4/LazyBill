<script lang="ts">
	import type { Snippet } from "svelte";

	type Props = {
		title: string;
		children: Snippet;
	};

	let { title, children }: Props = $props();
</script>

<div class="grid grid-cols-1 gap-12 md:grid-cols-[16rem_1fr]">
	<h2 class="lg:text-right text-xl">{title}</h2>
	<div class="grid grid-cols-1 lg:grid-cols-[24rem_24rem] gap-x-16 gap-y-8">
		{@render children?.()}
	</div>
</div>
