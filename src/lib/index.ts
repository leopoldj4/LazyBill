export function debounce<T>(fn: (value: T) => Promise<void>): (value: T) => void {
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	return (value: T) => {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		debounceTimer = setTimeout(async () => {
			await fn(value);
		}, 500);
	};
}
