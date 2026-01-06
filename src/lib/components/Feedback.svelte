<script lang="ts">
	import { api } from '$convex/_generated/api';
	import { useConvexClient } from 'convex-svelte';
	import { SidebarMenuButton } from '$lib/components/ui/sidebar';
	import MessageCircleIcon from '@lucide/svelte/icons/message-circle';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';

	const client = useConvexClient();

	let open = $state(false);

	let message = $state('');
</script>

<Dialog.Root {open} onOpenChange={(value) => (open = value)}>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<SidebarMenuButton {...props}>
				<MessageCircleIcon />
				Feedback
			</SidebarMenuButton>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Feedback</Dialog.Title>
		</Dialog.Header>
		<Textarea placeholder="Feedback" bind:value={message} />
		<Dialog.Footer>
			<Button
				onclick={() => {
					client.mutation(api.beta.addFeedback, { message });
					open = false;
				}}>Senden</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
