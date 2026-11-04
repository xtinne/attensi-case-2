<script lang="ts">
	import { stepTypes } from '$lib/steps';
	import type { StepType } from '$lib/types';
	import { Lock } from '@lucide/svelte';

	type Props = {
		nextStepNumber: number;
		blockingStepNumber: number | null;
		onAdd: (type: StepType) => void;
		onGoToBlockingStep: () => void;
	};

	let { nextStepNumber, blockingStepNumber, onAdd, onGoToBlockingStep }: Props = $props();
</script>

<div
	class="mt-5 flex flex-col gap-3 rounded-[18px] border-2 border-dashed border-border-strong px-4 py-3.5 sm:px-5"
>
	<div class="flex flex-wrap items-center gap-3">
		<span
			aria-hidden="true"
			class="grid size-9 place-items-center rounded-full border-2 border-dashed border-border-strong font-display font-medium text-muted"
		>
			{nextStepNumber}
		</span>
		<span class="font-semibold text-cocoa-light">Add a step:</span>

		<div class="flex flex-wrap gap-1.5">
			{#each stepTypes as stepType (stepType.type)}
				<button
					type="button"
					disabled={blockingStepNumber !== null}
					aria-label="Add {stepType.label} step"
					aria-describedby={blockingStepNumber !== null ? 'add-step-hint' : undefined}
					onclick={() => onAdd(stepType.type)}
					class="flex h-9.5 cursor-pointer items-center gap-1.5 rounded-[10px] border-[1.5px] border-border bg-white pr-3.5 pl-2.5 text-sm font-semibold hover:not-disabled:border-accent hover:not-disabled:text-accent-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-dark disabled:cursor-not-allowed disabled:opacity-40"
				>
					<stepType.icon
						size={18}
						strokeWidth={1.6}
						aria-hidden="true"
						class="shrink-0 text-accent-dark"
					/>
					{stepType.label}
				</button>
			{/each}
		</div>
	</div>

	{#if blockingStepNumber !== null}
		<div
			class="flex flex-wrap items-center gap-2.5 rounded-xl bg-warning-tint px-3 py-2.5 text-sm font-medium text-warning"
		>
			<Lock size={18} strokeWidth={1.8} aria-hidden="true" class="shrink-0" />
			<span id="add-step-hint" class="flex-[1_1_160px]">
				Finish step {blockingStepNumber} first.
			</span>
			<button
				type="button"
				onclick={onGoToBlockingStep}
				class="h-8 cursor-pointer rounded-lg bg-white px-3 font-semibold shadow-[0_1px_2px_rgba(43,29,22,0.1)] hover:bg-page focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-dark"
			>
				Go to step {blockingStepNumber}
			</button>
		</div>
	{/if}
</div>
