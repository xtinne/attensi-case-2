<script lang="ts">
	import AddStep from '$lib/components/AddStep.svelte';
	import CourseHeader from '$lib/components/CourseHeader.svelte';
	import LearnerPreview from '$lib/components/LearnerPreview.svelte';
	import StepItem from '$lib/components/StepItem.svelte';
	import { createExampleSteps } from '$lib/exampleCourse';
	import { createStep, getMissingContent } from '$lib/steps';
	import type { Step, StepType } from '$lib/types';
	import { Pencil } from '@lucide/svelte';
	import { tick } from 'svelte';

	const exampleSteps = createExampleSteps();

	let courseName = $state('Tempering dark chocolate');
	let steps = $state<Step[]>(exampleSteps);
	let activeStepId = $state<string | null>(exampleSteps[0].id);

	let firstIncompleteIndex = $derived(steps.findIndex((step) => getMissingContent(step) !== null));
	let hasIncompleteStep = $derived(firstIncompleteIndex !== -1);

	function focusStep(id: string) {
		document.querySelector<HTMLElement>(`#content-${id} :is(textarea, input)`)?.focus();
	}

	async function addStep(type: StepType) {
		if (hasIncompleteStep) return;

		const step = createStep(type);
		steps.push(step);
		activeStepId = step.id;

		await tick();
		focusStep(step.id);
	}

	function deleteStep(id: string) {
		const step = steps.find((s) => s.id === id);
		if (!step) return;

		if (!confirm('Delete this step? This can’t be undone.')) return;

		const index = steps.indexOf(step);
		steps = steps.filter((s) => s.id !== id);

		// The step that took its place, or the new last step when the last one was deleted.
		if (activeStepId === id) activeStepId = steps[Math.min(index, steps.length - 1)]?.id ?? null;
	}

	function moveStep(index: number, direction: -1 | 1) {
		const targetIndex = index + direction;
		if (targetIndex < 0 || targetIndex >= steps.length) return;

		const stepToMove = steps[index];
		steps[index] = steps[targetIndex];
		steps[targetIndex] = stepToMove;
	}
</script>

<svelte:head>
	<title>Attensi: Technical case - Frontend Developer</title>
</svelte:head>

<!-- A file dropped outside the drop area would otherwise open in the tab and lose the course. -->
<svelte:window
	ondragover={(event) => event.preventDefault()}
	ondrop={(event) => event.preventDefault()}
/>

<CourseHeader {steps} />

<main class="mx-auto mt-8 flex max-w-295 flex-col items-start gap-8 px-5 pb-12 lg:flex-row">
	<div class="w-full min-w-0 lg:flex-1">
		<label class="mb-6 flex flex-col gap-3">
			<span class="text-[13px] font-semibold tracking-[0.08em] text-muted uppercase"
				>Course name</span
			>
			<span
				class="flex items-center gap-2.5 rounded-[14px] border-[1.5px] border-border bg-white pr-3.5 pl-4 focus-within:border-accent focus-within:shadow-[0_0_0_4px_rgba(18,130,142,0.12)]"
			>
				<input
					type="text"
					placeholder="Name your course"
					bind:value={courseName}
					class="min-w-0 flex-1 py-0.5 font-display text-[clamp(1.5rem,3vw,2rem)] leading-[1.4] font-bold tracking-[-0.02em] outline-none placeholder:text-placeholder"
				/>
				<Pencil size={20} strokeWidth={1.6} aria-hidden="true" class="shrink-0 text-muted" />
			</span>
		</label>

		<h2 class="mb-3 flex items-center gap-2">
			Steps
			<span class="grid h-5 min-w-5 place-items-center rounded-full bg-sand px-1.5 tracking-normal">
				{steps.length}
			</span>
		</h2>

		<ol class="grid list-none gap-5 p-0">
			{#each steps as step, index (step.id)}
				<StepItem
					bind:step={steps[index]}
					stepNumber={index + 1}
					isActive={step.id === activeStepId}
					isFirst={index === 0}
					isLast={index === steps.length - 1}
					onSelect={() => (activeStepId = step.id)}
					onMoveUp={() => moveStep(index, -1)}
					onMoveDown={() => moveStep(index, 1)}
					onDelete={() => deleteStep(step.id)}
				/>
			{/each}
		</ol>

		{#if steps.length === 0}
			<p
				class="rounded-[18px] border-[1.5px] border-border bg-white px-6 py-10 text-center text-muted"
			>
				No steps yet. Pick a step type below to get started.
			</p>
		{/if}

		<AddStep
			nextStepNumber={steps.length + 1}
			blockingStepNumber={hasIncompleteStep ? firstIncompleteIndex + 1 : null}
			onAdd={addStep}
			onGoToBlockingStep={() => focusStep(steps[firstIncompleteIndex].id)}
		/>
	</div>

	<LearnerPreview {steps} {activeStepId} onSelectStep={(id) => (activeStepId = id)} />
</main>
