import { LanguageModelOptions } from './language-model-options';
import * as data from './data/english-model.json';
import { NullTemplateVisitor } from '@angular/compiler';

interface Model {
	monograms: any;
	bigrams: any;
	trigrams: any;
	quadgrams: any;
}

const model = (data as any).default as Model;

export class LanguageModel {
	private static readonly SPACE_END_WEIGHT = 100;
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

	private rateNGram(ngram: string, finalRating: boolean): number {
		if (ngram.includes('-')) {
			let rating = 0;
			const subs = ngram.split('-');
			// Special Treatment for Word Borders
			// rate(A-B) => rate(A) + rate(B)
			// rate(AB-) => rate(AB) (if not final); rate(AB) + spaceEndWeight (if final)
			for (const sub of subs) {
				if (sub.length === 0) {
					if (finalRating) {
						rating += LanguageModel.SPACE_END_WEIGHT;
					}
				} else {
					rating += this.getNGramRating(sub);
				}
			}
			return rating;
		}
		return this.getNGramRating(ngram);
	}

	private getNGramRating(ngram: string) {
		const map = this.getMap(ngram.length);
		if (map.has(ngram)) {
			return 1 - map.get(ngram);
		}
		return 1;
	}

	public rate(name: string, finalRating?: boolean): number {
		if (finalRating === undefined || finalRating === null) {
			finalRating = false;
		}

		let total = 0;
		for (let n = 2; n < 5; n++) {
			const end = name.length - n + 1;
			const weight = this.getWeight(n);
			for (let i = 0; i < end; i++) {
				const ngram = name.substring(i, i + n);
				let rating = this.rateNGram(ngram, finalRating);

				if (this.options.nGramBackoff) {
					if (i === 0) {
						for (let j = 1; j < n; j++) {
							const backoff = name.substring(0, j);
							rating += this.rateNGram(backoff, finalRating);
						}
					}

					if (i === end - 1) {
						for (let j = 1; j < n; j++) {
							const backoff = name.substring(name.length - j, name.length);
							rating += this.rateNGram(backoff, finalRating);
						}
					}
				}
				total += rating * weight;
			}
		}

		return total;
	}
}
