<script lang="ts">
	import type { Step } from '$lib/types';
	import { ChevronLeft, ChevronRight, CircleCheck, CircleX } from '@lucide/svelte';

	type Props = {
		steps: Step[];
		activeStepId: string | null;
		onSelectStep: (id: string) => void;
	};

	let { steps, activeStepId, onSelectStep }: Props = $props();

	/** The answer a viewer picked per question, so it's still there after going Back or Next. */
	let pickedOptionIds = $state<Record<string, string>>({});

	let activeIndex = $derived(steps.findIndex((step) => step.id === activeStepId));
	let step = $derived<Step | undefined>(steps[activeIndex]);

	let filledOptions = $derived(
		step ? step.contents.choice.options.filter((option) => option.text.trim() !== '') : []
	);
	let pickedOption = $derived(
		step ? filledOptions.find((option) => option.id === pickedOptionIds[step.id]) : undefined
	);

	let prompt = $derived.by(() => {
		if (!step) return 'Add a step to see the preview.';
		if (step.type === 'text' && step.contents.text.body.trim() === '') {
			return 'Add text to see this step.';
		}
		if (step.type === 'image' && step.contents.image.src === '') {
			return 'Add an image to see this step.';
		}
		if (step.type === 'choice' && step.contents.choice.question.trim() === '') {
			return 'Add a question to see this step.';
		}
		return null;
	});
</script>

<aside class="flex w-full flex-col gap-3 lg:sticky lg:top-6 lg:w-95 lg:shrink-0">
	<div class="flex items-center justify-between">
		<h2>Learner preview</h2>
		{#if step}
			<span class="text-[13px] font-semibold text-muted">
				Step {activeIndex + 1} of {steps.length}
			</span>
		{/if}
	</div>

	<div
		class="flex min-h-85 flex-col gap-4 rounded-3xl bg-text p-5.5 text-page shadow-[0_20px_40px_-20px_rgba(43,29,22,0.5)]"
	>
		<div class="flex gap-1.25">
			{#each steps as { id }, index (id)}
				<button
					type="button"
					aria-label="Preview step {index + 1}"
					aria-current={index === activeIndex ? 'step' : undefined}
					onclick={() => onSelectStep(id)}
					class="flex h-4 flex-1 cursor-pointer items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-light"
				>
					<span
						class={[
							'h-1.25 w-full rounded-full',
							index === activeIndex && 'bg-accent-light',
							index < activeIndex && 'bg-accent-light/45',
							index > activeIndex && 'bg-white/15'
						]}
					></span>
				</button>
			{/each}
		</div>

		<div class="flex flex-1 flex-col gap-3.5">
			{#if prompt}
				<p
					class="grid flex-1 place-items-center rounded-[14px] border-[1.5px] border-dashed border-white/15 p-6 text-center text-latte"
				>
					{prompt}
				</p>
			{:else if step?.type === 'text'}
				<p
					class="font-display text-[21px] leading-[1.4] font-medium text-pretty whitespace-pre-wrap"
				>
					{step.contents.text.body}
				</p>
			{:else if step?.type === 'image'}
				<img
					src={step.contents.image.src}
					alt={step.contents.image.alt}
					class="block max-h-70 w-full rounded-[14px] object-contain"
				/>
			{:else if step?.type === 'choice'}
				{@const { id } = step}
				{@const { question, correctOptionId } = step.contents.choice}

				<p class="font-display text-xl leading-[1.35] font-bold text-pretty">{question}</p>

				<div class="flex flex-col gap-2">
					{#each filledOptions as option (option.id)}
						{@const isPicked = pickedOption?.id === option.id}
						{@const isCorrect = option.id === correctOptionId}

						<button
							type="button"
							aria-pressed={isPicked}
							onclick={() => (pickedOptionIds[id] = option.id)}
							class={[
								'flex min-h-11.5 w-full cursor-pointer items-center justify-between gap-2.5 rounded-xl border-[1.5px] px-3.5 py-2.5 text-left font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-light',
								!isPicked && 'border-white/15 bg-white/6 hover:bg-white/12',
								isPicked && isCorrect && 'border-success bg-success',
								isPicked && !isCorrect && 'border-danger bg-danger'
							]}
						>
							{option.text}
							{#if isPicked && isCorrect}
								<CircleCheck size={20} aria-hidden="true" class="shrink-0" />
							{:else if isPicked}
								<CircleX size={20} aria-hidden="true" class="shrink-0" />
							{/if}
						</button>
					{/each}
				</div>

				<p role="status" class="min-h-6 font-semibold">
					{#if pickedOption && correctOptionId === null}
						<span class="text-latte">No correct answer is marked yet.</span>
					{:else if pickedOption?.id === correctOptionId}
						<span class="text-success-light">Correct, nicely done!</span>
					{:else if pickedOption}
						<span class="text-danger-light">Not quite. Give it another go.</span>
					{/if}
				</p>
			{/if}
		</div>

		<div class="flex justify-between gap-2">
			<button
				type="button"
				disabled={activeIndex <= 0}
				onclick={() => onSelectStep(steps[activeIndex - 1].id)}
				class="flex h-9.5 cursor-pointer items-center gap-1 rounded-[10px] bg-white/8 pr-3.5 pl-2 text-sm font-semibold hover:not-disabled:bg-white/14 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-light disabled:cursor-not-allowed disabled:opacity-35"
			>
				<ChevronLeft size={20} aria-hidden="true" />
				Back
			</button>
			<button
				type="button"
				disabled={activeIndex >= steps.length - 1}
				onclick={() => onSelectStep(steps[activeIndex + 1].id)}
				class="flex h-9.5 cursor-pointer items-center gap-1 rounded-[10px] bg-accent pr-2 pl-3.5 text-sm font-semibold text-white hover:not-disabled:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-light disabled:cursor-not-allowed disabled:opacity-35"
			>
				Next
				<ChevronRight size={20} aria-hidden="true" />
			</button>
		</div>
	</div>

	<p class="text-center text-[13px] text-muted">Select a step to preview it as a learner.</p>
</aside>
