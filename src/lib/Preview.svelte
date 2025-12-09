<script lang="ts">
	import { render } from './render';

	type Props = {
		typstDocument: string;
	};

	let { typstDocument }: Props = $props();

	let preview: HTMLDivElement | null = $state(null);

	$effect(() => {
		render(typstDocument).then((svg) => {
			preview!.innerHTML = svg;

			const svgElem = preview!.firstElementChild!;
			const width = Number.parseFloat(svgElem.getAttribute('width')!);
			const height = Number.parseFloat(svgElem.getAttribute('height')!);
			const cw = (document.body.clientWidth - 40) / 2.5;
			svgElem.setAttribute('width', cw.toString());
			svgElem.setAttribute('height', ((height * cw) / width).toString());
		});
	});
</script>

<div bind:this={preview} class="border border-red-400"></div>
