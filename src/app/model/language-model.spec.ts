import { LanguageModel } from './language-model';
import { LanguageModelOptions } from './language-model-options';
import { TestBed, async, inject } from '@angular/core/testing';
import { ModelLoaderService } from '../modules/main/services/model-loader.service';

/**
 * Language Model Unit Tests
 */
describe('Language Model', () => {
	let model: LanguageModel;

	beforeAll(async(() => {
		TestBed.configureTestingModule({
			providers: [ModelLoaderService]
		}).compileComponents();
	}));

	beforeAll( async(inject([ModelLoaderService], (loader: ModelLoaderService) => {
		const options = new LanguageModelOptions(1, 1, 1, true);
		loader.subscribeToModel(m => {
			model = new LanguageModel(options, m);
		});
	})));

	// Sanity check XAX should be more common than XXA.
	it('Bigram Check', () => {
		expect(model.rate('XAX')).toBeLessThan(model.rate('XXA'));
	});

	// Sanity check: Single A's should be rated better than a double A bigram.
	it('Wordboundary Check', () => {
		expect(model.rate('A-A')).toBeLessThan(model.rate('-AA'));
	});

	// Check if empty-word punishment works
	it('Final Check', () => {
		expect(model.rate('-AA', false)).toBeLessThan(model.rate('-AA', true));
	});

	// Sanity check wheather something more pronouncable has a better score thn something bad.
	it('Sora Check', () => {
		expect(model.rate('ROXAS', true)).toBeLessThan(model.rate('SXROA', true));
	});
});
