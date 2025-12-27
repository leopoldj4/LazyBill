export function ask(title: string, message?: string): Promise<boolean> {
	return new Promise((resolve) => {
		queue.push({ title, message, resolve });
	});
}

export const queue = $state<{ title: string, message?: string, resolve: (value: boolean) => void }[]>([]);