import { getAuthState } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import { createAuth } from '$convex/auth.js';
import { redirect } from '@sveltejs/kit';

export const ssr = false;
export const prerender = false;	