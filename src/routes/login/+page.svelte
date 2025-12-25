<script lang="ts">
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import MailIcon from '@lucide/svelte/icons/mail';
	import HeroImage from './hero.jpg';
	import { authClient } from '$lib/auth-client.js';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	import GoogleIcon from './google.svg';

	let email = $state('');
	let password = $state('');

	let error = $state('');

	async function login(e: Event) {
		e.preventDefault();

		const { error: loginError } = await authClient.signIn.email({
			email: email,
			password: password,
			callbackURL: '/app',
		});

		if (loginError) {
			error = loginError.message || 'An unknown error occurred';
		}
	}
</script>

<h1 class="font-display text-5xl">Watchtower</h1>

<div class="flex w-full max-w-xs flex-col gap-4">
	<a
		href="/login/email"
		class="flex w-full flex-row items-center gap-4 rounded-md border border-border px-6 py-4"
	>
		<MailIcon class="size-4" />
		Sign in with E-Mail
	</a>

	<div class="mt-4 text-center">
		Don't have an account?
		<a href="/sign-up" class="text-cyan-600 underline"> Sign up </a>
	</div>
</div>
