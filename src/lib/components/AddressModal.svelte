<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import EditIcon from '@lucide/svelte/icons/edit';
	import { PlaceAutocomplete } from 'places-autocomplete-svelte';
	import type { ComponentOptions, PlaceResult } from 'places-autocomplete-svelte/interfaces';
	import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';
	import { useConvexClient } from 'convex-svelte';
	import { api } from '$convex/_generated/api';
	import type { Id } from '$convex/_generated/dataModel';
	import { action } from '$lib/action.svelte';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';

	let open = $state(false);

	type Props = {
		customerId: Id<'customers'>;
	};

	let { customerId }: Props = $props();

	const requestParams = {
		region: 'DE',
		language: 'de-DE',
		includedRegionCodes: ['DE'],
	};

	const options: Partial<ComponentOptions> = {
		distance: true,
		distance_units: 'km',
		clear_input: true,
		placeholder: 'Geben sie ihre Adresse ein...',
		classes: {
			section: 'ring-none',
			container: 'relative z-10 transform rounded-xl mt-4',
			icon_container: 'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>',
			input:
				'border-1 w-full rounded-md border-0 shadow-sm bg-gray-100 px-4 py-2.5 pl-10 pr-20 text-gray-900 sm:text-sm',
			kbd_container: 'absolute inset-y-0 right-0 flex py-1.5 pr-1.5',
			kbd_escape: 'hidden',
			kbd_up:
				'inline-flex items-center justify-center rounded border border-gray-300 px-1 font-sans text-xs text-gray-500 w-6',
			kbd_down:
				'inline-flex items-center rounded border border-gray-400 px-1 font-sans text-xs text-gray-500 justify-center w-6',
			kbd_active: 'bg-blue-500 text-white',
			ul: 'absolute z-50 -mb-2 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm divide-y divide-gray-100',
			li: 'z-50 cursor-default select-none py-2 px-2 lg:px-4 text-gray-900 hover:bg-blue-500 hover:text-white',
			li_current: 'bg-blue-500',
			li_a: 'block w-full flex justify-between',
			li_a_current: 'text-white',
			li_div_container: 'flex min-w-0 gap-x-4',
			li_div_one: 'min-w-0 flex flex-row items-center gap-x-4',
			li_div_one_p: 'text-sm/6 justify-self-start',
			li_div_two: 'shrink-0 flex flex-col items-end min-w-16',
			li_div_two_p: 'mt-1 text-xs/5',
			highlight: 'font-bold',
		},
	};

	const client = useConvexClient();

	let autocomplete: PlaceAutocomplete | null = $state(null);
	
	$effect(() => {
		if (autocomplete && open) {
			const timeout = setTimeout(() => {
				autocomplete?.focus();
			}, 150);
			return () => clearTimeout(timeout);
		}
	});
	
	const update = action(async (response: PlaceResult) => {
		function component(name: string) {
			return (
				response.addressComponents.find((component) => component.types.includes(name))?.longText ||
				''
			);
		}

		await client.mutation(api.customers.updateAddress, {
			id: customerId,
			country: component('country'),
			state: component('administrative_area_level_1'),
			city: component('locality'),
			zip: component('postal_code'),
			street: component('route') + ' ' + component('street_number'),
		});

		open = false;
	}, 'Fehler beim Aktualisieren der Adresse');

	function onError(error: string) {
		console.error(error);
	}
</script>

<Dialog.Root {open} onOpenChange={(value) => (!update.isLoading && (open = value))}>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
		<EditIcon class="h-4 w-4" />
		Adresse bearbeiten
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Adresse bearbeiten</Dialog.Title>
				<Dialog.Description>Bitte geben Sie die Adresse des Kunden ein.</Dialog.Description>
			</Dialog.Header>
			{#if update.isLoading}
				<div class="flex h-64 items-center justify-center">
					<Spinner class="h-4 w-4 animate-spin" />
				</div>
			{:else}
				<PlaceAutocomplete
					bind:this={autocomplete}
					onResponse={update.run}
					{onError}
					{options}
					{requestParams}
					{PUBLIC_GOOGLE_MAPS_API_KEY}
				/>
				<Dialog.Footer>
					<Button variant="outline" onclick={() => (open = false)}>Abbrechen</Button>
				</Dialog.Footer>
			{/if}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
