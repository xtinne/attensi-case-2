<script lang="ts">
	import { createOption, MIN_CHOICE_OPTIONS } from '$lib/steps';
	import type { ChoiceContent } from '$lib/types';
	import { Check, Plus, X } from '@lucide/svelte';
	import { tick } from 'svelte';

	type Props = {
		stepId: string;
		content: ChoiceContent;
	};

	let { content = $bindable(), stepId }: Props = $props();

	let canRemoveOption = $derived(content.options.length > MIN_CHOICE_OPTIONS);

	function focusOption(id: string) {
		document.getElementById(`option-${id}`)?.focus();
	}

	async function addOption() {
		const option = createOption();
		content.options.push(option);

		await tick();
		focusOption(option.id);
	}

	function removeOption(id: string) {
		content.options = content.options.filter((option) => option.id !== id);

		if (content.correctOptionId === id) content.correctOptionId = null;
	}

	function handleOptionKeydown(event: KeyboardEvent, index: number) {
		if (event.key !== 'Enter') return;

		event.preventDefault();

		const nextOption = content.options[index + 1];
		if (nextOption) focusOption(nextOption.id);
		else addOption();
	}
</script>

<label class="sr-only" for="question-{stepId}">Question</label>
<input
	id="question-{stepId}"
	type="text"
	placeholder="What do you want to ask?"
	bind:value={content.question}
	class="h-12.5 w-full min-w-0 rounded-xl border-[1.5px] border-border bg-field px-4 text-[17px] font-semibold outline-none placeholder:font-normal placeholder:text-placeholder focus:border-accent focus:shadow-[0_0_0_4px_rgba(18,130,142,0.12)]"
/>

<fieldset class="mt-3.5">
	<legend class="text-sm">
		<span class="font-bold">Answers</span>
		<span class="ml-1 text-muted">Select the circle to mark the correct one</span>
	</legend>

	<ul class="mt-2.5 grid list-none gap-2 p-0">
		{#each content.options as option, index (option.id)}
			{@const isCorrect = content.correctOptionId === option.id}

			<li class="flex items-center gap-2.5">
				<span class="relative grid size-7.5 shrink-0 place-items-center">
					<input
						type="radio"
						name="correct-{stepId}"
						value={option.id}
						bind:group={content.correctOptionId}
						aria-label="Mark option {index + 1} as correct"
						class="peer absolute inset-0 cursor-pointer appearance-none rounded-full border-2 border-muted bg-white checked:border-success checked:bg-success focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-dark"
					/>
					<Check
						size={18}
						strokeWidth={3}
						aria-hidden="true"
						class="pointer-events-none relative text-white opacity-0 peer-checked:opacity-100"
					/>
				</span>

				<label class="sr-only" for="option-{option.id}">Option {index + 1}</label>
				<input
					id="option-{option.id}"
					type="text"
					placeholder="Option {index + 1}"
					bind:value={option.text}
					onkeydown={(event) => handleOptionKeydown(event, index)}
					class={[
						'h-11.5 w-full min-w-0 flex-1 rounded-xl border-[1.5px] px-3.5 font-medium outline-none placeholder:font-normal placeholder:text-placeholder focus:border-accent focus:shadow-[0_0_0_4px_rgba(18,130,142,0.12)]',
						isCorrect ? 'border-success-border bg-success-tint' : 'border-border bg-field'
					]}
				/>

				<button
					type="button"
					disabled={!canRemoveOption}
					aria-label="Remove option {index + 1}"
					title={canRemoveOption
						? 'Remove option'
						: `A question needs at least ${MIN_CHOICE_OPTIONS} options`}
					onclick={() => removeOption(option.id)}
					class="grid size-8.5 shrink-0 cursor-pointer place-items-center rounded-[9px] text-muted hover:not-disabled:bg-sand hover:not-disabled:text-text focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-dark disabled:cursor-not-allowed disabled:opacity-30"
				>
					<X size={18} strokeWidth={1.6} aria-hidden="true" />
				</button>
			</li>
		{/each}
	</ul>
</fieldset>

<div class="mt-3 flex flex-wrap items-center gap-3 pl-10">
	<button
		type="button"
		onclick={addOption}
		class="flex h-9.5 cursor-pointer items-center gap-1.5 rounded-[10px] border-[1.5px] border-dashed border-border-strong pr-3.5 pl-2.5 text-sm font-semibold text-cocoa-light hover:border-accent hover:bg-tint hover:text-accent-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-dark"
	>
		<Plus size={18} strokeWidth={1.6} aria-hidden="true" />
		Add option
	</button>
	<span class="text-[13px] text-muted">or press Enter in the last answer</span>
</div>
