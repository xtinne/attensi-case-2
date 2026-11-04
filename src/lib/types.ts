export type TextContent = { body: string };

export type ImageContent = { src: string; alt: string };

export type ChoiceOption = { id: string; text: string };
export type ChoiceContent = {
	question: string;
	options: ChoiceOption[];
	correctOptionId: string | null;
};

export type StepType = 'text' | 'image' | 'choice';

// A step keeps the content of all three types, so switching type and back loses nothing.
export type Step = {
	id: string;
	type: StepType;
	contents: {
		text: TextContent;
		image: ImageContent;
		choice: ChoiceContent;
	};
};
