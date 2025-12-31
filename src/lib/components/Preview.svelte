<script lang="ts">
	import { browser } from '$app/environment';
	import typst from '$lib/typst';
	import { Spinner } from './ui/spinner';

	type Props = {
		typstDocument: string;
		rerender?: () => void;
		resize?: () => void;
	};

	let { typstDocument, rerender = $bindable() }: Props = $props();

	let preview: HTMLDivElement | null = $state(null);
	let error: Error | null = $state(null);
	let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

	if (rerender) {
		rerender = () => render(typstDocument);
	}

	async function render(doc: string) {
		try {
			const svg = await typst.svg({ mainContent: doc });
			preview!.innerHTML = svg;
			resize();
		} catch (e) {
			console.log(doc);
			error = e as Error;
		}
	}

	function resize() {
		if (!preview) return;
		const parentWidth = preview.clientWidth;

		const svgElem = preview.firstElementChild!;
		const width = Number.parseFloat(svgElem!.getAttribute('width')!);
		const height = Number.parseFloat(svgElem!.getAttribute('height')!);
		const newHeight = (parentWidth / width) * height;
		svgElem!.setAttribute('height', newHeight.toString());
		svgElem!.setAttribute('width', parentWidth.toString());
	}

	function renderDebounced(doc: string) {
		if (debounceTimeout) clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			render(doc);
		}, 150);
	}

	if (browser) {
		window.addEventListener('resize', resize);
	}

	$effect(() => {
		if (!browser) return;
		renderDebounced(typstDocument);
	});
</script>

{#if error}
	<div class="relative w-full min-w-0 overflow-hidden border">
		<p>{error.toString()}</p>
	</div>
{:else}
	<div bind:this={preview} class="relative w-full min-w-0 overflow-hidden border">
		<div class="grid aspect-[1/1.414] w-full place-items-center">
			<Spinner />
		</div>
	</div>
{/if}
