import { toast } from "svelte-sonner";

export function action<T>(action: (args: T) => Promise<void>, errorMessage: string) {
    let isLoading = $state(false);

    async function run(args: T) {
        if (isLoading) return;

        isLoading = true;
        try {
            await action(args);
        } catch (error) {
            console.error(error);
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