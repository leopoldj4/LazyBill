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

	let fitScale = 1;
	let scale = $state(1);
	let translateX = $state(0);
	let translateY = $state(0);
	let isPanning = $state(false);
	let startX = 0;
	let startY = 0;

	// SVG natural dimensions (before scaling)
	let svgNaturalWidth = 0;
	let svgNaturalHeight = 0;

	// Scrollbar state
	let isDraggingScrollbarH = false;
	let isDraggingScrollbarV = false;
	let scrollbarDragStart = 0;
	let scrollbarDragTranslateStart = 0;

	// Touch gesture state
	let lastTouchDist = 0;
	let lastTouchCenterX = 0;
	let lastTouchCenterY = 0;
	let isTouching = false;

	const MIN_SCALE = 0.25;
	const MAX_SCALE = 5;

	if (rerender) {
		rerender = () => render(typstDocument);
	}

	function fitToContainer() {
		if (!container || !preview) return;
		const svgElem = preview.querySelector('svg');
		if (!svgElem) return;

		const containerWidth = container.clientWidth;
		const containerHeight = container.clientHeight;
		svgNaturalWidth = parseFloat(svgElem.getAttribute('width')!);
		svgNaturalHeight = parseFloat(svgElem.getAttribute('height')!);

		fitScale = Math.min(containerWidth / svgNaturalWidth, containerHeight / svgNaturalHeight);
		scale = fitScale;
		translateX = (containerWidth - svgNaturalWidth * fitScale) / 2;
		translateY = (containerHeight - svgNaturalHeight * fitScale) / 2;
	}

	async function render(doc: string) {
		try {
			const svg = await typst.svg({ mainContent: doc });
			preview!.innerHTML = svg;
			fitToContainer();
		} catch (e) {
			console.log(doc);
			error = e as Error;
		}
	}

	function renderDebounced(doc: string) {
		if (debounceTimeout) clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			render(doc);
		}, 150);
	}

	function handleWheel(e: WheelEvent) {
		e.preventDefault();
		if (e.ctrlKey || e.metaKey) {
			const delta = e.deltaY > 0 ? 0.9 : 1.1;
			const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * delta));

			const rect = container!.getBoundingClientRect();
			const cursorX = e.clientX - rect.left;
			const cursorY = e.clientY - rect.top;

			translateX = cursorX - ((cursorX - translateX) * newScale) / scale;
			translateY = cursorY - ((cursorY - translateY) * newScale) / scale;
			scale = newScale;
		} else {
			translateX -= e.deltaX;
			translateY -= e.deltaY;
		}
	}

	function handlePointerDown(e: PointerEvent) {
		if (isTouching) return;
		if (e.button === 1 || (e.button === 0 && (e.metaKey || e.ctrlKey || e.shiftKey))) {
			e.preventDefault();
			isPanning = true;
			startX = e.clientX - translateX;
			startY = e.clientY - translateY;
			container!.setPointerCapture(e.pointerId);
		}
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isPanning) return;
		translateX = e.clientX - startX;
		translateY = e.clientY - startY;
	}

	function handlePointerUp(e: PointerEvent) {
		if (isPanning) {
			isPanning = false;
			container!.releasePointerCapture(e.pointerId);
		}
	}

	function getTouchDist(touches: TouchList) {
		const dx = touches[0].clientX - touches[1].clientX;
		const dy = touches[0].clientY - touches[1].clientY;
		return Math.hypot(dx, dy);
	}

	function getTouchCenter(touches: TouchList) {
		return {
			x: (touches[0].clientX + touches[1].clientX) / 2,
			y: (touches[0].clientY + touches[1].clientY) / 2,
		};
	}

	function handleTouchStart(e: TouchEvent) {
		if (e.touches.length === 2) {
			e.preventDefault();
			isTouching = true;
			lastTouchDist = getTouchDist(e.touches);
			const center = getTouchCenter(e.touches);
			lastTouchCenterX = center.x;
			lastTouchCenterY = center.y;
		} else if (e.touches.length === 1) {
			isTouching = true;
			isPanning = true;
			startX = e.touches[0].clientX - translateX;
			startY = e.touches[0].clientY - translateY;
		}
	}

	function handleTouchMove(e: TouchEvent) {
		if (e.touches.length === 2) {
			e.preventDefault();
			const dist = getTouchDist(e.touches);
			const center = getTouchCenter(e.touches);
			const rect = container!.getBoundingClientRect();
			const centerX = center.x - rect.left;
			const centerY = center.y - rect.top;

			const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * (dist / lastTouchDist)));
			translateX = centerX - ((centerX - translateX) * newScale) / scale;
			translateY = centerY - ((centerY - translateY) * newScale) / scale;

			// Also pan with the center movement
			translateX += center.x - lastTouchCenterX;
			translateY += center.y - lastTouchCenterY;

			scale = newScale;
			lastTouchDist = dist;
			lastTouchCenterX = center.x;
			lastTouchCenterY = center.y;
		} else if (e.touches.length === 1 && isPanning) {
			translateX = e.touches[0].clientX - startX;
			translateY = e.touches[0].clientY - startY;
		}
	}

	function handleTouchEnd(e: TouchEvent) {
		if (e.touches.length < 2) {
			isTouching = false;
			isPanning = false;
		}
	}

	// Scrollbar calculations
	const SCROLLBAR_SIZE = 6;
	const SCROLLBAR_PADDING = 2;
	const MIN_THUMB = 24;

	let scrollbar = $derived.by(() => {
		if (!container) return { showH: false, showV: false } as const;
		const cw = container.clientWidth;
		const ch = container.clientHeight;
		const contentW = svgNaturalWidth * scale;
		const contentH = svgNaturalHeight * scale;

		const showH = contentW > cw + 1;
		const showV = contentH > ch + 1;

		const trackH = cw - SCROLLBAR_PADDING * 2 - (showV ? SCROLLBAR_SIZE + SCROLLBAR_PADDING : 0);
		const trackV = ch - SCROLLBAR_PADDING * 2 - (showH ? SCROLLBAR_SIZE + SCROLLBAR_PADDING : 0);

		const hThumbRatio = Math.min(1, cw / contentW);
		const vThumbRatio = Math.min(1, ch / contentH);

		const hThumbSize = Math.max(MIN_THUMB, hThumbRatio * trackH);
		const vThumbSize = Math.max(MIN_THUMB, vThumbRatio * trackV);

		const maxScrollX = contentW - cw;
		const maxScrollY = contentH - ch;

		const hFraction = maxScrollX > 0 ? Math.max(0, Math.min(1, -translateX / maxScrollX)) : 0;
		const vFraction = maxScrollY > 0 ? Math.max(0, Math.min(1, -translateY / maxScrollY)) : 0;

		const hThumbPos = hFraction * (trackH - hThumbSize);
		const vThumbPos = vFraction * (trackV - vThumbSize);

		return { showH, showV, trackH, trackV, hThumbSize, vThumbSize, hThumbPos, vThumbPos };
	});

	function handleScrollbarPointerDown(axis: 'h' | 'v', e: PointerEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (axis === 'h') {
			isDraggingScrollbarH = true;
			scrollbarDragStart = e.clientX;
			scrollbarDragTranslateStart = translateX;
		} else {
			isDraggingScrollbarV = true;
			scrollbarDragStart = e.clientY;
			scrollbarDragTranslateStart = translateY;
		}
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	}

	function handleScrollbarPointerMove(axis: 'h' | 'v', e: PointerEvent) {
		if (axis === 'h' && !isDraggingScrollbarH) return;
		if (axis === 'v' && !isDraggingScrollbarV) return;
		if (!container) return;

		const cw = container.clientWidth;
		const ch = container.clientHeight;
		const contentW = svgNaturalWidth * scale;
		const contentH = svgNaturalHeight * scale;

		if (axis === 'h') {
			const trackH = scrollbar.trackH!;
			const thumbSize = scrollbar.hThumbSize!;
			const delta = e.clientX - scrollbarDragStart;
			const scrollDelta = (delta / (trackH - thumbSize)) * (contentW - cw);
			translateX = scrollbarDragTranslateStart - scrollDelta;
		} else {
			const trackV = scrollbar.trackV!;
			const thumbSize = scrollbar.vThumbSize!;
			const delta = e.clientY - scrollbarDragStart;
			const scrollDelta = (delta / (trackV - thumbSize)) * (contentH - ch);
			translateY = scrollbarDragTranslateStart - scrollDelta;
		}
	}

	function handleScrollbarPointerUp(axis: 'h' | 'v', e: PointerEvent) {
		if (axis === 'h') isDraggingScrollbarH = false;
		if (axis === 'v') isDraggingScrollbarV = false;
		(e.target as HTMLElement).releasePointerCapture(e.pointerId);
	}

	function resetView() {
		fitToContainer();
	}

	function zoomIn() {
		scale = Math.min(MAX_SCALE, scale * 1.25);
	}

	function zoomOut() {
		scale = Math.max(MIN_SCALE, scale / 1.25);
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
	<div class="relative w-full min-w-0 overflow-hidden border">
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

		<!-- Pan/zoom viewport -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			bind:this={container}
			class="aspect-[1/1.414] w-full touch-none overflow-hidden bg-gray-100 dark:bg-neutral-900"
			class:cursor-grabbing={isPanning}
			class:cursor-default={!isPanning}
			onpointerdown={handlePointerDown}
			onpointermove={handlePointerMove}
			onpointerup={handlePointerUp}
			ontouchstart={handleTouchStart}
			ontouchmove={handleTouchMove}
			ontouchend={handleTouchEnd}
		>
			<div
				bind:this={preview}
				class="origin-top-left bg-white shadow-lg"
				style="transform: translate({translateX}px, {translateY}px) scale({scale}); width: fit-content;"
			>
				<div class="grid aspect-[1/1.414] w-full min-w-[400px] place-items-center">
					<Spinner />
				</div>
			</div>

			<!-- Horizontal scrollbar -->
			{#if scrollbar.showH}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="absolute bottom-0 left-0 z-10"
					style="height: {SCROLLBAR_SIZE + SCROLLBAR_PADDING * 2}px; width: calc(100% - {scrollbar.showV ? SCROLLBAR_SIZE + SCROLLBAR_PADDING : 0}px);"
				>
					<div
						class="absolute rounded-full bg-black/40 transition-colors hover:bg-black/60 dark:bg-white/40 dark:hover:bg-white/60"
						style="
							left: {SCROLLBAR_PADDING + scrollbar.hThumbPos}px;
							top: {SCROLLBAR_PADDING}px;
							width: {scrollbar.hThumbSize}px;
							height: {SCROLLBAR_SIZE}px;
						"
						onpointerdown={(e) => handleScrollbarPointerDown('h', e)}
						onpointermove={(e) => handleScrollbarPointerMove('h', e)}
						onpointerup={(e) => handleScrollbarPointerUp('h', e)}
					></div>
				</div>
			{/if}

			<!-- Vertical scrollbar -->
			{#if scrollbar.showV}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="absolute top-0 right-0 z-10"
					style="width: {SCROLLBAR_SIZE + SCROLLBAR_PADDING * 2}px; height: calc(100% - {scrollbar.showH ? SCROLLBAR_SIZE + SCROLLBAR_PADDING : 0}px);"
				>
					<div
						class="absolute rounded-full bg-black/40 transition-colors hover:bg-black/60 dark:bg-white/40 dark:hover:bg-white/60"
						style="
							top: {SCROLLBAR_PADDING + scrollbar.vThumbPos}px;
							left: {SCROLLBAR_PADDING}px;
							height: {scrollbar.vThumbSize}px;
							width: {SCROLLBAR_SIZE}px;
						"
						onpointerdown={(e) => handleScrollbarPointerDown('v', e)}
						onpointermove={(e) => handleScrollbarPointerMove('v', e)}
						onpointerup={(e) => handleScrollbarPointerUp('v', e)}
					></div>
				</div>
			{/if}
		</div>
	</div>
{/if}
