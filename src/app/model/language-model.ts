import { LanguageModelOptions } from './language-model-options';
import { ParsedModel } from './model';


export class LanguageModel {
	private static readonly EMPTY_WORD_WEIGHT = 100;
	private weights: number[];

	constructor(private readonly options: LanguageModelOptions, private readonly nGramModel: ParsedModel) {
		this.weights = [options.biWeight, options.triWeight, options.quadWeight];
	}

	private getMap(n: number): Map<string, number> {
		return this.nGramModel[n - 1];
	}

	private getWeight(n: number): number {
		return this.weights[n - 2];
	}

	private getNGramRating(ngram: string) {
		const map = this.getMap(ngram.length);
		if (map.has(ngram)) {
			return 1 - map.get(ngram);
		}
		return 1;
	}

	private rateWord(name: string): number {
		if (name.length < 2) {
			return this.getNGramRating(name);
		}

		let total = 0;
		for (let n = 2; n < 5; n++) {
			const end = name.length - n + 1;
			const weight = this.getWeight(n);
			for (let i = 0; i < end; i++) {
				const ngram = name.substring(i, i + n);
				let rating = this.getNGramRating(ngram);

				if (this.options.nGramBackoff) {
					if (i === 0) {
						for (let j = 1; j < n; j++) {
							const backoff = name.substring(0, j);
							rating += this.getNGramRating(backoff);
						}
					}

					if (i === end - 1) {
						for (let j = 1; j < n; j++) {
							const backoff = name.substring(name.length - j, name.length);
							rating += this.getNGramRating(backoff);
						}
					}
				}
				total += rating * weight;
			}
		}
		return total;
	}

	public rate(name: string, isFinalRating: boolean = false): number {
		let total = 0;
		const words = name.split('-');
		for (const word of words) {
			if (word.length > 0) {
				total += this.rateWord(word);
			} else if (isFinalRating) {
				total += LanguageModel.EMPTY_WORD_WEIGHT;
			}
		}

		return total;
	}
}
