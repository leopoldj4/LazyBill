<script lang="ts">
	import MailIcon from '@lucide/svelte/icons/mail';
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
