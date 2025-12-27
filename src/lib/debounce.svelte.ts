import { untrack } from 'svelte';

/**
 * Creates a debounced store that auto-saves on value changes and supports external reload.
 *
 * @param initialValue - The initial value of the store
 * @param onSave - Callback when value should be saved (debounced 500ms)
 * @param onReload - Callback to reload data (debounced 10s)
 * @param options - Optional configuration for debounce timings
 */
export function createDebouncedStore<T>(
	initialValue: T,
	onSave: (value: T) => void | Promise<void>,
	onReload: () => void | Promise<void>,
	options: { saveDelay?: number; reloadDelay?: number } = {},
) {
	const { saveDelay = 500, reloadDelay = 10000 } = options;

	let value = $state<T>(initialValue);
	let saveTimeout: ReturnType<typeof setTimeout> | null = null;
	let reloadTimeout: ReturnType<typeof setTimeout> | null = null;
	let isSaving = $state(false);
	let isReloading = $state(false);
	let initialized = false;

	function clearSaveTimeout() {
		if (saveTimeout) {
			clearTimeout(saveTimeout);
			saveTimeout = null;
		}
	}

	function clearReloadTimeout() {
		if (reloadTimeout) {
			clearTimeout(reloadTimeout);
			reloadTimeout = null;
		}
	}

	function scheduleSave() {
		clearSaveTimeout();
		// Reset reload timer when we're about to save
		clearReloadTimeout();

		saveTimeout = setTimeout(async () => {
			const snapshot = untrack(() => $state.snapshot(value) as T);
			isSaving = true;
			try {
				await onSave(snapshot);
			} finally {
				isSaving = false;
			}
		}, saveDelay);
	}

	function scheduleReload() {
		clearReloadTimeout();

		reloadTimeout = setTimeout(async () => {
			isReloading = true;
			try {
				await onReload();
			} finally {
				isReloading = false;
			}
		}, reloadDelay);
	}

	// Track deep changes using $effect
	$effect(() => {
		// Access the snapshot to trigger reactivity on deep changes
		$state.snapshot(value);

		// Skip save on initial mount
		if (!initialized) {
			initialized = true;
			return;
		}

		untrack(() => scheduleSave());
	});

	return {
		get value() {
			return value;
		},
		set value(newValue: T) {
			value = newValue;
		},
		get isSaving() {
			return isSaving;
		},
		get isReloading() {
			return isReloading;
		},
		/**
		 * Request a reload (debounced). Timer resets if called again within delay.
		 */
		reload() {
			scheduleReload();
		},
		/**
		 * Force an immediate save, bypassing debounce
		 */
		async saveNow() {
			clearSaveTimeout();
			clearReloadTimeout();
			isSaving = true;
			try {
				await onSave($state.snapshot(value) as T);
			} finally {
				isSaving = false;
			}
		},
		/**
		 * Force an immediate reload, bypassing debounce
		 */
		async reloadNow() {
			clearReloadTimeout();
			isReloading = true;
			try {
				await onReload();
			} finally {
				isReloading = false;
			}
		},
		/**
		 * Update the value directly (useful for setting from reload)
		 * This does NOT trigger a save
		 */
		setWithoutSave(newValue: T) {
			clearSaveTimeout();
			value = newValue;
		},
		/**
		 * Clean up timers (call on component destroy)
		 */
		destroy() {
			clearSaveTimeout();
			clearReloadTimeout();
		},
	};
}

