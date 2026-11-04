<script lang="ts">
	import ChoiceEditor from '$lib/components/ChoiceEditor.svelte';
	import ImageEditor from '$lib/components/ImageEditor.svelte';
	import TextEditor from '$lib/components/TextEditor.svelte';
	import { getMissingContent, stepTypes } from '$lib/steps';
	import type { Step } from '$lib/types';
	import { ArrowUp, ArrowDown, Circle, CircleCheck, Trash } from '@lucide/svelte';

	type Props = {
		step: Step;
		stepNumber: number;
		isActive: boolean;
		isFirst: boolean;
		isLast: boolean;
		onSelect: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
		onDelete: () => void;
	};

	let {
		step = $bindable(),
		stepNumber,
		isActive,
		isFirst,
		isLast,
		onSelect,
		onMoveUp,
		onMoveDown,
		onDelete
	}: Props = $props();

	let missingContent = $derived(getMissingContent(step));
</script>

<li
	onpointerdown={onSelect}
	onfocusin={onSelect}
	class={[
		'@container rounded-[18px] border-[1.5px] bg-white px-4 py-3.5 transition-shadow sm:px-5',
		isActive
			? 'border-border-strong shadow-[0_14px_32px_-18px_rgba(43,29,22,0.35)]'
			: 'border-border shadow-[0_1px_2px_rgba(43,29,22,0.04)]'
	]}
>
	<div class="flex flex-wrap items-center gap-3">
		<h3
			class={[
				'grid size-9 place-items-center rounded-full font-display font-medium transition-colors',
				isActive ? 'bg-accent text-white' : 'bg-sand text-cocoa-light'
			]}
		>
			<span class="sr-only">Step </span>{stepNumber}
		</h3>

		<div
			role="group"
			aria-label="Step type"
			class="order-1 flex w-full gap-0.5 rounded-xl bg-sand p-1 @min-[680px]:order-0 @min-[680px]:w-auto"
		>
			{#each stepTypes as stepType (stepType.type)}
				<button
					type="button"
					aria-pressed={step.type === stepType.type}
					onclick={() => (step.type = stepType.type)}
					class="flex h-8.5 flex-auto cursor-pointer items-center justify-center gap-1.5 rounded-[9px] px-3 text-sm font-medium whitespace-nowrap text-muted hover:text-text focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-dark aria-pressed:bg-white aria-pressed:text-accent-dark aria-pressed:shadow-[0_1px_3px_rgba(43,29,22,0.12),0_0_0_1px_rgba(18,130,142,0.25)] @max-xs:px-1.5"
				>
					<stepType.icon
						size={18}
						strokeWidth={1.6}
						aria-hidden="true"
						class="shrink-0 @max-xs:hidden"
					/>
					{stepType.label}
				</button>
			{/each}
		</div>

		{#if missingContent}
			<p
				class="order-2 flex h-7 items-center gap-1.5 rounded-full bg-warning-tint px-2.5 text-[13px] font-semibold whitespace-nowrap text-warning @md:order-0 @md:ml-auto"
			>
				<Circle size={14} strokeWidth={2} aria-hidden="true" />
				{missingContent}
			</p>
		{/if}

		<div class={['ml-auto flex items-center gap-3', missingContent && '@md:ml-0']}>
			{#if !missingContent}
				<span title="Ready" class="grid place-items-center text-success">
					<CircleCheck size={20} strokeWidth={2} aria-hidden="true" />
					<span class="sr-only">Ready</span>
				</span>
			{/if}

			<div class="flex gap-0.5">
				<button
					type="button"
					disabled={isFirst}
					aria-label="Move step {stepNumber} up"
					title="Move up"
					onclick={onMoveUp}
					class="grid size-8.5 cursor-pointer place-items-center rounded-[9px] text-muted hover:not-disabled:bg-sand hover:not-disabled:text-text focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-dark disabled:cursor-not-allowed disabled:opacity-30"
				>
					<ArrowUp size={20} strokeWidth={1.6} aria-hidden="true" />
				</button>

				<button
					type="button"
					disabled={isLast}
					aria-label="Move step {stepNumber} down"
					title="Move down"
					onclick={onMoveDown}
					class="grid size-8.5 cursor-pointer place-items-center rounded-[9px] text-muted hover:not-disabled:bg-sand hover:not-disabled:text-text focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-dark disabled:cursor-not-allowed disabled:opacity-30"
				>
					<ArrowDown size={20} strokeWidth={1.6} aria-hidden="true" />
				</button>

				<button
					type="button"
					aria-label="Delete step {stepNumber}"
					title="Delete step"
					onclick={onDelete}
					class="grid size-8.5 cursor-pointer place-items-center rounded-[9px] text-muted hover:bg-danger-tint hover:text-danger focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-dark"
				>
					<Trash size={20} strokeWidth={1.6} aria-hidden="true" />
				</button>
			</div>
		</div>
	</div>

	<div id="content-{step.id}" class="mt-4">
		{#if step.type === 'text'}
			<TextEditor bind:content={step.contents.text} stepId={step.id} />
		{:else if step.type === 'image'}
			<ImageEditor bind:content={step.contents.image} />
		{:else}
			<ChoiceEditor bind:content={step.contents.choice} stepId={step.id} />
		{/if}
	</div>
</li>
