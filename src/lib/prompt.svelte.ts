export function prompt(title: string, message?: string): Promise<boolean> {
	console.log('prompt', title, message);
	return new Promise((resolve) => {
		queue.push({ type: 'prompt', title, message, resolve });
	});
}

export function alert(title: string, message?: string): Promise<void> {
	return new Promise((resolve) => {
		queue.push({ type: 'alert', title, message, resolve });
	});
}

type Prompt = {
	type: 'prompt';
	title: string;
	message?: string;
	resolve: (value: boolean) => void;
}

type Alert = {
	type: 'alert';
	title: string;
	message?: string;
	resolve: () => void;
}

type QueueItem = Prompt | Alert;

export const queue = $state<QueueItem[]>([]);