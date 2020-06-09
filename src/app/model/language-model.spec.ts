import { LanguageModel } from './language-model';
import { LanguageModelOptions } from './language-model-options';

describe('Language Model', () => {
	let model: LanguageModel;

	beforeAll(() => {
		const options = new LanguageModelOptions(1, 1, 1, true);
		model = new LanguageModel(options);
	});

	it('Bigram Check', () => {
		expect(model.rate('XAX')).toBeLessThan(model.rate('XXA'));
	});

	it('Wordboundary Check', () => {
		expect(model.rate('A-A')).toBeLessThan(model.rate('-AA'));
	});

	it('Final Check', () => {
		expect(model.rate('-AA', false)).toBeLessThan(model.rate('-AA', true));
	});

	it('Sora Check', () => {
		expect(model.rate('ROXAS', true)).toBeLessThan(model.rate('SXROA', true));
	});
});
