import { toast } from "svelte-sonner";

export function action(action: () => Promise<void>, errorMessage: string) {
	let isLoading = $state(false);

	async function run() {
		isLoading = true;
		try {
			await action();
		} catch (error) {
			toast.error(errorMessage);
		} finally {
			isLoading = false;
		}
	}

	return {
		get isLoading() { return isLoading; },
		run,
	};
}