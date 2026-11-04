<script lang="ts">
	import { getMissingContent } from '$lib/steps';
	import type { Step } from '$lib/types';

	type Props = {
		steps: Step[];
	};

	let { steps }: Props = $props();

	const MAX_BAR_PIECES = 6;

	let readyCount = $derived(steps.filter((step) => getMissingContent(step) === null).length);
	let barPieces = $derived(Math.max(1, Math.min(steps.length, MAX_BAR_PIECES)));
	let goldPieces = $derived(
		steps.length === 0 ? 0 : Math.floor((readyCount * barPieces) / steps.length)
	);
	let readyLabel = $derived.by(() => {
		if (steps.length === 0) return 'No steps yet';

		return `${readyCount} of ${steps.length} ${steps.length === 1 ? 'step' : 'steps'} ready`;
	});
</script>

<header class="mx-auto max-w-295 px-5 pt-6">
	<div
		class="relative flex flex-wrap items-end justify-between gap-x-12 gap-y-7 overflow-hidden rounded-3xl bg-text px-6 py-8 text-page sm:px-9 sm:py-10"
	>
		<!-- Decorative chocolate squares behind the text -->
		<div
			aria-hidden="true"
			class="pointer-events-none absolute -inset-y-3.5 -right-3.5 grid w-[min(560px,60%)] origin-right -rotate-4 grid-cols-5 grid-rows-3 gap-2 mask-[linear-gradient(to_left,#000_35%,transparent_95%)]"
		>
			{#each { length: 15 }, index (index)}
				<div
					class="rounded-[10px] bg-cocoa-dark shadow-[inset_3px_3px_0_rgba(255,255,255,0.05),inset_-4px_-4px_0_rgba(0,0,0,0.28)]"
				></div>
			{/each}
		</div>

		<div class="relative flex min-w-0 flex-[1_1_320px] flex-col gap-3">
			<span class="text-xs font-bold tracking-[0.16em] text-gold uppercase">
				Willy Wonka’s Chocolate Factory
			</span>
			<h1>Wonka’s Course <span class="whitespace-nowrap">Builder 🍫</span></h1>
			<p class="leading-normal text-pretty text-latte">
				Turn a new recipe or safety rule into a course yourself, one step at a time.
			</p>
		</div>

		<div class="relative flex flex-col gap-2">
			<span class="text-sm font-semibold text-latte">{readyLabel}</span>
			<div aria-hidden="true" class="flex w-fit gap-1 rounded-[10px] bg-cocoa p-1.5">
				{#each { length: barPieces }, index (index)}
					<div
						class={[
							'h-6.5 w-8.5 rounded-[5px] shadow-[inset_0_-3px_0_rgba(0,0,0,0.25),inset_0_2px_0_rgba(255,255,255,0.08)] transition-colors duration-300',
							index < goldPieces ? 'bg-gold' : 'bg-cocoa-light'
						]}
					></div>
				{/each}
			</div>
		</div>
	</div>
</header>
