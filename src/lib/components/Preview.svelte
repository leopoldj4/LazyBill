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
	let translateX = $state(0);
	let translateY = $state(0);
	let isPanning = $state(false);
	let startX = 0;
	let startY = 0;

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

	async function render(doc: string) {
		try {
			const svg = await typst.svg({ mainContent: doc });
			preview!.innerHTML = svg;
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
		if (e.ctrlKey || e.metaKey) {
			e.preventDefault();
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

	function resetView() {
		scale = 1;
		translateX = 0;
		translateY = 0;
	}

	function zoomIn() {
		scale = Math.min(MAX_SCALE, scale * 1.25);
	}

	function zoomOut() {
		scale = Math.max(MIN_SCALE, scale / 1.25);
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
				class="min-w-[3.5rem] rounded px-2 py-1 text-center text-xs tabular-nums hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
				title="Reset view"
			>
				{Math.round(scale * 100)}%
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
			onwheel={handleWheel}
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
		</div>
	</div>
{/if}
