<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { queue } from '$lib/ask.svelte';

	function resolve(value: boolean) {
		queue[queue.length - 1].resolve(value);
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
				<Button variant="outline" onclick={() => resolve(false)}>Abbrechen</Button>
				<Button onclick={() => resolve(true)}>Ja</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
