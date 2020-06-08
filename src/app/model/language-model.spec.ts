import { LanguageModel } from './language-model';
import { LanguageModelOptions } from './language-model-options';

describe('Language Model', () => {
	let model: LanguageModel;

	beforeAll(() => {
		const options = new LanguageModelOptions(1, 1, 1, true);
		model = new LanguageModel(options);
	});

	it('Bigram Check', () => {
		expect(model.rate('xax')).toBeLessThan(model.rate('xxa'));
	});

	it('Wordboundary Check', () => {
		expect(model.rate('a-a')).toBeLessThan(model.rate('-aa'));
	});

	it('Final Check', () => {
		expect(model.rate('-aa', false)).toBeLessThan(model.rate('-aa', true));
	});
});
