<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";


	function formatIBAN(value: string) {
		const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();

		const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;

		return { formatted, cleaned };
	}

	function handleInput(e: Event) {
		const { formatted, cleaned } = formatIBAN((e.target as HTMLInputElement).value);

		if (cleaned.length <= 34) {
			iban = formatted;
			value = cleaned;
		}
	}

	function handlePaste(e: ClipboardEvent) {
		e.preventDefault();
		const pastedText = e.clipboardData?.getData('text') ?? '';
		const { formatted, cleaned } = formatIBAN(pastedText);

		if (cleaned.length <= 34) {
			iban = formatted;
			value = cleaned;
		}
	}

	type Props = {
		value: string;
	} & HTMLInputAttributes;

	let { value = $bindable(), ...restProps }: Props = $props();
	let iban = $state(formatIBAN(value).formatted);

</script>

<input
	type="text"
	bind:value={iban}
	on:input={handleInput}
	on:paste={handlePaste}
    maxlength={44}
	placeholder="DE12 3456 7890 1234 5678 90"
	{...restProps}
/>
