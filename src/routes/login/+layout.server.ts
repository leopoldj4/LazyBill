import { createConvexHttpClient, getAuthState } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import { redirect } from '@sveltejs/kit';
import { createAuth } from '$convex/auth';

export const load = async ({ cookies }) => {
	const authState = await getAuthState(createAuth, cookies);

	if (authState.isAuthenticated) {
		throw redirect(307, '/app');
	}
	return {
		authState,
	};
};

