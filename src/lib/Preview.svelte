<script lang="ts">
	import { browser } from '$app/environment';
	import { typst } from '$lib/render';
	import { Spinner } from './components/ui/spinner';

	type Props = {
		typstDocument: string;
	};

	let { typstDocument }: Props = $props();

	let preview: HTMLDivElement | null = $state(null);
	let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

	async function render(doc: string) {
		const svg = await typst.svg({ mainContent: doc });
		preview!.innerHTML = svg;

		const parentWidth = preview!.clientWidth;

		const svgElem = preview!.firstElementChild!;
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
		window.addEventListener('resize', () => renderDebounced	(typstDocument));
	}

	$effect(() => {
		if (!browser) return;
		renderDebounced(typstDocument);
	});
</script>

<div bind:this={preview} class="relative w-full border">
	<div class="w-full aspect-[1/1.414] grid place-items-center">
		<Spinner />
	</div>
</div>
