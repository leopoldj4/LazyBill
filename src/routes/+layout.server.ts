import { getAuthState } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import { createAuth } from '$convex/auth.js';

export const load = async ({ cookies }) => {
	return {
		authState: await getAuthState(createAuth, cookies),
	};
};
