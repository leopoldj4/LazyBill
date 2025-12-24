<script lang="ts">
	import { browser } from '$app/environment';
	import { render } from './render';

	type Props = {
		typstDocument: string;
	};

	let { typstDocument }: Props = $props();

	let preview: HTMLDivElement | null = $state(null);

	function renderSvg(svg: string) {
		preview!.innerHTML = svg;

		const svgElem = preview!.firstElementChild!;

		svgElem.setAttribute('width', '500px');
		svgElem.setAttribute('height', '700px');
	}

	if (browser) window.addEventListener('resize', () => render(typstDocument).then(renderSvg));

	$effect(() => {
		render(typstDocument).then(renderSvg);
	});
</script>

<div bind:this={preview} class="w-[500px] h-[700px] border border-gray-300"></div>
