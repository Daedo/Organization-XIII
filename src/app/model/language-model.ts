import { LanguageModelOptions } from './language-model-options';
import * as data from '../../assets/english-model.json';

interface Model {
	monograms: any;
	bigrams: any;
	trigrams: any;
	quadgrams: any;
}

const model = (data as any).default as Model;

export class LanguageModel {
	private static readonly EMPTY_WORD_WEIGHT = 100;
	private maps: Map<string, number>[];
	private weights: number[];

	constructor(private readonly options: LanguageModelOptions) {
		this.loadModel();
		this.weights = [options.biWeight, options.triWeight, options.quadWeight];
	}

	private loadModel() {
		const monograms = new Map();
		this.fill(monograms, model.monograms);

		const bigrams = new Map();
		this.fill(bigrams, model.bigrams);

		const trigrams = new Map();
		this.fill(trigrams, model.trigrams);

		const quadgrams = new Map();
		this.fill(quadgrams, model.quadgrams);
		this.maps = [monograms, bigrams, trigrams, quadgrams];
	}

	private fill(map: Map<string, number>, gData: any) {
		for (const gram in gData) {
			if (gData.hasOwnProperty(gram)) {
				const value = gData[gram];
				map.set(gram, value);
			}
		}
	}

	private getMap(n: number): Map<string, number> {
		return this.maps[n - 1];
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
