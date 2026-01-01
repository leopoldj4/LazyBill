<script lang="ts">
	import MailIcon from '@lucide/svelte/icons/mail';
	import GoogleIcon from "$lib/assets/google.svg";
	import { authClient } from '$lib/auth-client';
	import BetaBadge from '$lib/components/BetaBadge.svelte';
	import { useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { goto } from '$app/navigation';

	const auth = useAuth();

	if (auth.isAuthenticated) {
		goto('/app');
	}
</script>

<h1 class="font-display text-5xl flex flex-row items-center gap-2">LazyBill <BetaBadge /></h1>

<div class="flex w-full max-w-xs flex-col gap-4">
	<a
		href="/login/email"
		class="flex w-full flex-row items-center gap-4 rounded-md border border-border px-6 py-4"
	>
		<MailIcon class="size-4" />
		Sign in with E-Mail
	</a>

	<button
		onclick={async () => {
			await authClient.signIn.social({
				callbackURL: '/app',
				provider: 'google',
			});
		}}
		class="flex w-full flex-row items-center gap-4 rounded-md border border-border px-6 py-4 cursor-pointer"
	>
		<img src={GoogleIcon} alt="Google" class="size-4" />
		Sign in with Google
	</button>
</div>
