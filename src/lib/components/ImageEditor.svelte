<script lang="ts">
	import type { ImageContent } from '$lib/types';
	import { ImagePlus, Upload } from '@lucide/svelte';

	type Props = {
		content: ImageContent;
	};

	let { content = $bindable() }: Props = $props();

	let hasInvalidFile = $state(false);
	let isDraggingOver = $state(false);

	function useFile(file: File | undefined) {
		if (!file) return;

		hasInvalidFile = !file.type.startsWith('image/');
		if (hasInvalidFile) return;

		if (content.src) URL.revokeObjectURL(content.src);
		content.src = URL.createObjectURL(file);
		content.alt = '';
	}

	function chooseFile(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = '';
		useFile(file);
	}

	function dropFile(event: DragEvent) {
		event.preventDefault();
		isDraggingOver = false;
		useFile(event.dataTransfer?.files[0]);
	}
</script>

{#if content.src}
	<img
		src={content.src}
		alt={content.alt}
		class="mb-3 block max-h-90 w-full rounded-[14px] bg-sand object-contain"
	/>

	<label
		class="inline-flex h-9.5 cursor-pointer items-center gap-1.5 rounded-[10px] border-[1.5px] border-border pr-3.5 pl-2.5 text-sm font-semibold hover:border-accent hover:text-accent-dark has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent-dark"
	>
		<Upload size={18} strokeWidth={1.6} aria-hidden="true" />
		Choose another image
		<input type="file" accept="image/*" onchange={chooseFile} class="sr-only" />
	</label>
{:else}
	<label
		ondragover={(event) => {
			event.preventDefault();
			isDraggingOver = true;
		}}
		ondragleave={() => (isDraggingOver = false)}
		ondrop={dropFile}
		class={[
			'flex cursor-pointer flex-col items-center gap-2.5 rounded-[14px] border-2 border-dashed px-5 py-9 text-center transition-colors *:pointer-events-none has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent-dark',
			isDraggingOver ? 'border-accent bg-tint' : 'border-border-strong bg-field'
		]}
	>
		<span class="grid size-13 place-items-center rounded-full bg-tint text-accent-dark">
			<ImagePlus size={26} strokeWidth={1.6} aria-hidden="true" />
		</span>
		<span class="font-semibold">
			Drop an image here, or
			<span class="text-accent-dark underline underline-offset-3">browse</span>
		</span>
		<span class="text-sm text-muted">PNG, JPG or GIF</span>
		<input type="file" accept="image/*" onchange={chooseFile} class="sr-only" />
	</label>
{/if}

{#if hasInvalidFile}
	<p role="alert" class="mt-2 text-sm text-danger">
		That file isn’t an image. Please try another file.
	</p>
{/if}

{#if content.src}
	<label class="mt-3 block text-sm font-semibold">
		Image description (optional)
		<input
			type="text"
			placeholder="What does the image show?"
			bind:value={content.alt}
			class="mt-1 h-11 w-full min-w-0 rounded-xl border-[1.5px] border-border bg-field px-3.5 text-base font-normal outline-none placeholder:text-placeholder focus:border-accent focus:shadow-[0_0_0_4px_rgba(18,130,142,0.12)]"
		/>
	</label>
{/if}
