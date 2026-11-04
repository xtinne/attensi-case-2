<script lang="ts">
	import type { TextContent } from '$lib/types';

	type Props = {
		stepId: string;
		content: TextContent;
	};

	let { content = $bindable(), stepId }: Props = $props();
</script>

<label class="sr-only" for="body-{stepId}">Step text</label>
<textarea
	id="body-{stepId}"
	placeholder="What happens in this step?"
	bind:value={content.body}
	class="block field-sizing-content min-h-28 w-full resize-none rounded-xl border-[1.5px] border-border bg-field px-4 py-3.5 leading-normal outline-none placeholder:text-placeholder focus:border-accent focus:shadow-[0_0_0_4px_rgba(18,130,142,0.12)]"
></textarea>
