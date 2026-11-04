import type { ChoiceOption, Step, StepType } from '$lib/types';
import { CircleQuestionMark, Image, Type } from '@lucide/svelte';

export const MIN_CHOICE_OPTIONS = 2;

export const stepTypes: { type: StepType; label: string; icon: typeof Type }[] = [
	{ type: 'text', label: 'Text', icon: Type },
	{ type: 'image', label: 'Image', icon: Image },
	{ type: 'choice', label: 'Multiple choice', icon: CircleQuestionMark }
];

function createId(): string {
	return crypto.randomUUID().slice(0, 8);
}

export function createOption(): ChoiceOption {
	return { id: createId(), text: '' };
}

export function createStep(type: StepType, id: string = createId()): Step {
	return {
		id,
		type,
		contents: {
			text: { body: '' },
			image: { src: '', alt: '' },
			choice: {
				question: '',
				options: Array.from({ length: MIN_CHOICE_OPTIONS }, createOption),
				correctOptionId: null
			}
		}
	};
}

export function getMissingContent(step: Step): string | null {
	switch (step.type) {
		case 'text':
			return step.contents.text.body.trim() === '' ? 'Needs text' : null;
		case 'image':
			return step.contents.image.src === '' ? 'Needs an image' : null;
		case 'choice': {
			const { question, options, correctOptionId } = step.contents.choice;

			if (question.trim() === '') return 'Needs a question';
			if (options.some((option) => option.text.trim() === '')) return 'Fill in all answers';
			if (correctOptionId === null) return 'Mark the correct answer';

			return null;
		}
	}
}
