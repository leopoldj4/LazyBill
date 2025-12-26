<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import { Spinner } from './ui/spinner';
	import type { QueryResult } from '$lib';

	type Props = {
		children: Snippet<[T]>;
		query: QueryResult<T>;
	};

	let { children, query }: Props = $props();
</script>

{#if query.isLoading}
	<div class="flex w-full items-center justify-center">
		<Spinner />
	</div>
{:else if query.error}
	<div class="flex items-center justify-center">
		<p>{query.error.message}</p>
	</div>
{:else}
	{@render children(query.data as T)}
{/if}
