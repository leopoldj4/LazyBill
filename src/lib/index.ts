export type QueryResult<T> = {
	isLoading: boolean;
	isStale: boolean;
	error?: Error;
	data?: T;
};

export function debounce<T>(fn: (value: T) => Promise<void>, onrun?: () => void): (value: T) => void {
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	return (value: T) => {
		onrun?.();
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		debounceTimer = setTimeout(async () => {
			await fn(value);
		}, 500);
	};
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}