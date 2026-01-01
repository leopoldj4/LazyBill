<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { queue } from '$lib/prompt.svelte';

	function resolve(value: boolean) {
		const item = queue[queue.length - 1];
		if (item.type === 'prompt') {
			item.resolve(value);
		} else {
			item.resolve();
		}
		queue.pop();
	}
</script>

<Dialog.Root
	open={queue.length > 0}
	onOpenChange={(value) => {
		if (!value) {
			resolve(false);
		}
	}}
>
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>{queue.length > 0 ? queue[queue.length - 1].title : ''}</Dialog.Title>
				<Dialog.Description
					>{queue.length > 0 ? queue[queue.length - 1].message : ''}</Dialog.Description
				>
			</Dialog.Header>
			<Dialog.Footer>
				{#if queue.length > 0 && queue[queue.length - 1].type === 'prompt'}
					<Button variant="outline" onclick={() => resolve(false)}>Abbrechen</Button>
					<Button onclick={() => resolve(true)}>Ja</Button>
				{:else}
					<Button variant="outline" onclick={() => resolve(true)}>Ok</Button>
				{/if}
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
