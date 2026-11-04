import temperedChocolate from '$lib/assets/tempered-chocolate.webp';
import { createStep } from '$lib/steps';
import type { Step } from '$lib/types';

// Fixed ids, because these steps are rendered on both the server and the client.
export function createExampleSteps(): Step[] {
	const prepare = createStep('text', 'step-1');
	prepare.contents.text.body = 'Always clean your work surface before handling the chocolate.';

	const temperature = createStep('choice', 'step-2');
	temperature.contents.choice = {
		question: 'At what temperature should dark chocolate be tempered?',
		options: [
			{ id: 'option-1', text: '31–32 °C' },
			{ id: 'option-2', text: '45 °C' },
			{ id: 'option-3', text: '20 °C' }
		],
		correctOptionId: 'option-1'
	};

	const result = createStep('image', 'step-3');
	result.contents.image = {
		src: temperedChocolate,
		alt: 'Two smears of chocolate side by side: tempered chocolate looks smooth and glossy, untempered chocolate looks streaky.'
	};

	return [prepare, temperature, result];
}
