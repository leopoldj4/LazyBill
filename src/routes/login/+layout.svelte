<script lang="ts">
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import HeroImage from './hero.jpg';
</script>

<div class="grid h-screen grid-cols-[40%_60%]">
	<div class="flex h-screen flex-col items-start justify-between p-8">
		<div />
		<div class="flex w-full flex-col items-center justify-center gap-20">
			<slot />
		</div>
		<div class="text-sm text-muted-foreground">&copy; 2025 leoj.de. All rights reserved.</div>
	</div>
	<div class="relative h-full w-full">
		<div class="absolute inset-0 z-10 bg-linear-to-r from-white to-transparent"></div>
		<img src={HeroImage} alt="Hero" class="h-full w-full object-cover" />
	</div>
</div>
