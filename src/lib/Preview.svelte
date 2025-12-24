<script lang="ts">
	import { browser } from '$app/environment';
	import { typst } from '$lib/render';

	type Props = {
		typstDocument: string;
	};

	let { typstDocument }: Props = $props();

	let preview: HTMLDivElement | null = $state(null);

	async function render(doc: string) {
		const svg = await typst.svg({mainContent: doc});
		preview!.innerHTML = svg;

		const parentWidth = preview!.clientWidth;

		const svgElem = preview!.firstElementChild!;
		const width = Number.parseFloat(svgElem!.getAttribute('width')!);
		const height = Number.parseFloat(svgElem!.getAttribute('height')!);
		const newHeight = (parentWidth / width) * height;
		svgElem!.setAttribute('height', newHeight.toString());
		svgElem!.setAttribute('width', parentWidth.toString());
	}

	if (browser) {
		window.addEventListener('resize', () => render(typstDocument));
	}

	$effect(() => {
		if (!browser) return;
		render(typstDocument);
	});
</script>

<div bind:this={preview} class="relative w-full border">
</div>
