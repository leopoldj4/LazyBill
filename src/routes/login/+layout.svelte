<script lang="ts">
	import HeroImage from './Hero.jpg';
</script>

<div class="grid h-screen lg:grid-cols-[40%_60%]">
	<div class="flex min-h-screen flex-col items-start justify-between p-8">
		<div></div>
		<div class="flex w-full flex-col items-center justify-center gap-20">
			<slot />
		</div>
		<div class="text-sm text-muted-foreground">&copy; 2025 leoj.de. All rights reserved.</div>
	</div>
	<div class="relative hidden h-full w-full lg:block">
		<div class="absolute inset-0 z-10 lg:bg-linear-to-r from-white to-transparent"></div>
		<img src={HeroImage} alt="Hero" class="h-full w-full object-cover" />
	</div>
</div>
