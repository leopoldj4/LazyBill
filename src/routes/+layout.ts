import posthog from 'posthog-js'
import { browser } from '$app/environment';
import { onMount } from 'svelte';
import { PUBLIC_POSTHOG_KEY } from "$env/static/public";

export const load = async () => {
  if (browser) {
    posthog.init(
      PUBLIC_POSTHOG_KEY,
      {
        api_host: 'https://eu.i.posthog.com',
        defaults: '2025-11-30',
        person_profiles: 'always',
      }
    )
  }

  return
};
