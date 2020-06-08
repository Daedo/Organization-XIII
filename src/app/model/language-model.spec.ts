import { LanguageModel } from './language-model';
import { LanguageModelOptions } from './language-model-options';

describe('Language Model', () => {
	let model: LanguageModel;

	beforeAll(() => {
		const options = new LanguageModelOptions(1, 1, 1, true);
		model = new LanguageModel(options);
	});

	it('Sanity Check', () => {
		expect(model.rate('xax')).toBeLessThan(model.rate('xxa'));
	});

});
