import { LanguageModel } from './language-model';
import { LanguageModelOptions } from './language-model-options';
import { TestBed, async, inject } from '@angular/core/testing';
import { ModelLoaderService } from '../modules/main/services/model-loader.service';

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
