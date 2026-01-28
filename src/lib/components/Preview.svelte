<script lang="ts">
	import { browser } from '$app/environment';
	import { Spinner } from './ui/spinner';

	type Props = {
		documentDefinition: Record<string, unknown>;
		rerender?: () => void;
	};

	let { documentDefinition, rerender = $bindable() }: Props = $props();

	let previewUrl = $state<string | null>(null);
	let error: Error | null = $state(null);
	let isLoading = $state(false);
	let debounceTimeout: ReturnType<typeof setTimeout> | null = null;
	let pdfMakePromise: Promise<any> | null = null;

	if (rerender) {
		rerender = () => render(documentDefinition);
	}

	async function getPdfMake() {
		if (pdfMakePromise) return pdfMakePromise;
		pdfMakePromise = Promise.all([
			import('pdfmake/build/pdfmake'),
			import('pdfmake/build/vfs_fonts'),
		]).then(([pdfMakeModule, pdfFontsModule]) => {
			const pdfMake = pdfMakeModule.default ?? pdfMakeModule;
			const pdfFonts = pdfFontsModule.default ?? pdfFontsModule;
			pdfMake.vfs = pdfFonts.pdfMake.vfs;
			pdfMake.fonts = {
				Roboto: {
					normal: 'Roboto-Regular.ttf',
					bold: 'Roboto-Medium.ttf',
					italics: 'Roboto-Italic.ttf',
					bolditalics: 'Roboto-MediumItalic.ttf',
				},
			};
			return pdfMake;
		});
		return pdfMakePromise;
	}

	function revokePreviewUrl() {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			previewUrl = null;
		}
	}

	async function render(doc: Record<string, unknown>) {
		if (!browser) return;
		isLoading = true;
		error = null;
		try {
			const pdfMake = await getPdfMake();
			const blob = await new Promise<Blob>((resolve) => {
				pdfMake.createPdf(doc).getBlob((generated: Blob) => {
					resolve(generated);
				});
			});
			revokePreviewUrl();
			previewUrl = URL.createObjectURL(blob);
		} catch (e) {
			error = e as Error;
		} finally {
			isLoading = false;
		}
	}

	function renderDebounced(doc: Record<string, unknown>) {
		if (debounceTimeout) clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			render(doc);
		}, 150);
	}

	$effect(() => {
		if (!browser) return;
		renderDebounced(documentDefinition);
		return () => {
			if (debounceTimeout) clearTimeout(debounceTimeout);
		};
	});

	$effect(() => {
		return () => {
			revokePreviewUrl();
		};
	});
</script>

{#if error}
	<div class="relative w-full min-w-0 overflow-hidden border">
		<p>{error.toString()}</p>
	</div>
{:else}
	<div class="relative w-full min-w-0 overflow-hidden border bg-white">
		{#if previewUrl}
			<iframe
				class="block aspect-[1/1.414] w-full"
				title="Rechnung Vorschau"
				src={previewUrl}
			></iframe>
		{:else}
			<div class="grid aspect-[1/1.414] w-full place-items-center">
				<Spinner />
			</div>
		{/if}

		{#if isLoading}
			<div class="pointer-events-none absolute inset-0 grid place-items-center bg-white/60">
				<Spinner />
			</div>
		{/if}
	</div>
{/if}
