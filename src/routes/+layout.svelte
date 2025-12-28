<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import '@fontsource-variable/funnel-display';
	import '@fontsource/atkinson-hyperlegible/400';
	import '@fontsource/atkinson-hyperlegible/700';
	import { createSvelteAuthClient } from '@mmailaender/convex-better-auth-svelte/svelte';
	createSvelteAuthClient({ authClient });

	import favicon from '$lib/assets/logo.svg';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>LazyBill</title>
	<link rel="manifest" href="/manifest.json" />
</svelte:head>

{@render children?.()}
