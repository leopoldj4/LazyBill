import { createConvexHttpClient } from "@mmailaender/convex-better-auth-svelte/sveltekit";
import { api } from "$convex/_generated/api";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
    const client = createConvexHttpClient({ token: locals.token });
    const currentUser = await client.query(api.auth.getCurrentUser, {});
    if (!currentUser) {
        throw redirect(307, '/login');
    }
    return {
        currentUser,
    }
}