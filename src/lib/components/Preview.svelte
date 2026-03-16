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

	let container: HTMLDivElement | null = $state(null);
	let preview: HTMLDivElement | null = $state(null);
	let error: Error | null = $state(null);
	let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

	let scale = $state(1);
	let svgNaturalWidth = 0;
	let svgNaturalHeight = 0;

	const MIN_SCALE = 0.25;
	const MAX_SCALE = 5;

	// Scaled content dimensions for the scrollable area
	let contentWidth = $derived(svgNaturalWidth * scale);
	let contentHeight = $derived(svgNaturalHeight * scale);

	if (rerender) {
		rerender = () => render(typstDocument);
	}

	async function render(doc: string) {
		try {
			const svg = await typst.svg({ mainContent: doc });
			preview!.innerHTML = svg;

			const svgElem = preview!.querySelector('svg');
			if (svgElem) {
				svgNaturalWidth = parseFloat(svgElem.getAttribute('width')!);
				svgNaturalHeight = parseFloat(svgElem.getAttribute('height')!);
				// Remove intrinsic SVG size so it fills the wrapper
				svgElem.removeAttribute('width');
				svgElem.removeAttribute('height');
				svgElem.style.display = 'block';
				svgElem.style.width = '100%';
				svgElem.style.height = '100%';
				fitToContainer();
			}
		} catch (e) {
			console.log(doc);
			error = e as Error;
		}
	}

	function fitToContainer() {
		if (!container) return;
		// Temporarily hide overflow to measure without scrollbars affecting size
		container.style.overflow = 'hidden';
		const cw = container.clientWidth;
		const ch = container.clientHeight;
		container.style.overflow = '';
		scale = Math.min(cw / svgNaturalWidth, ch / svgNaturalHeight);
	}

	function renderDebounced(doc: string) {
		if (debounceTimeout) clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			render(doc);
		}, 150);
	}

	function handleWheel(e: WheelEvent) {
		if (!e.ctrlKey && !e.metaKey) return;
		e.preventDefault();

		const delta = 1 - e.deltaY * 0.008;
		const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * delta));
		if (newScale === scale) return;

		// Zoom toward cursor: preserve the content point under the cursor
		const rect = container!.getBoundingClientRect();
		const cursorX = e.clientX - rect.left + container!.scrollLeft;
		const cursorY = e.clientY - rect.top + container!.scrollTop;

		const ratio = newScale / scale;
		scale = newScale;

		requestAnimationFrame(() => {
			if (!container) return;
			container.scrollLeft = cursorX * ratio - (e.clientX - rect.left);
			container.scrollTop = cursorY * ratio - (e.clientY - rect.top);
		});
	}

	function resetView() {
		fitToContainer();
	}

	function zoomIn() {
		zoomCenter(1.25);
	}

	function zoomOut() {
		zoomCenter(1 / 1.25);
	}

	function zoomCenter(factor: number) {
		if (!container) return;
		const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * factor));
		if (newScale === scale) return;

		const centerX = container.scrollLeft + container.clientWidth / 2;
		const centerY = container.scrollTop + container.clientHeight / 2;

		const ratio = newScale / scale;
		scale = newScale;

		requestAnimationFrame(() => {
			if (!container) return;
			container.scrollLeft = centerX * ratio - container.clientWidth / 2;
			container.scrollTop = centerY * ratio - container.clientHeight / 2;
		});
	}

	// Attach wheel listener as non-passive so preventDefault() works
	$effect(() => {
		if (!container) return;
		container.addEventListener('wheel', handleWheel, { passive: false });
		return () => container!.removeEventListener('wheel', handleWheel);
	});

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
	<div class="relative w-full min-w-0 border">
		<!-- Toolbar -->
		<div
			class="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-md border bg-white/90 p-1 shadow-sm backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-800/90"
		>
			<button
				onclick={zoomOut}
				class="rounded px-2 py-1 text-sm hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
				title="Zoom out"
			>
				−
			</button>
			<button
				onclick={resetView}
				class="group min-w-[3.5rem] rounded px-2 py-1 text-center text-xs tabular-nums hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
				title="Reset view"
			>
				<span class="group-hover:hidden">{Math.round(scale * 100)}%</span>
				<span class="hidden group-hover:inline">reset</span>
			</button>
			<button
				onclick={zoomIn}
				class="rounded px-2 py-1 text-sm hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
				title="Zoom in"
			>
				+
			</button>
		</div>

		<!-- Scrollable viewport with native scrollbars -->
		<div
			bind:this={container}
			class="aspect-[1/1.414] w-full overflow-auto bg-gray-100 dark:bg-neutral-900"
		>
			<div
				bind:this={preview}
				class="bg-white shadow-lg"
				style="width: {contentWidth}px; height: {contentHeight}px;"
			>
				<div class="grid aspect-[1/1.414] w-full min-w-[400px] place-items-center">
					<Spinner />
				</div>
			</div>
		</div>
	</div>
{/if}
