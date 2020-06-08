import { GeneratorOptions } from './generator-options';
import { LanguageModel } from './language-model';
import * as PriorityQueue from 'priorityqueuejs';


interface Name {
	prio: number;
	name: string;
}

export class NameGenerator {
	private languageModel: LanguageModel;

	constructor(private readonly settings: GeneratorOptions) {
		this.languageModel = new LanguageModel(settings.modelOptions);
	}

	public runGenerator(): string[] {
		const name = this.settings.name.toLowerCase();
		const letters = [].concat(this.getLetters(name), this.getLetters(this.settings.sigil));
		for (let i = 0; i < this.settings.wordCount - 1; i++) {
			letters.push('-');
		}

		return this.generate(letters, true);
	}

	public getLetters(text: string): string[] {
		const out = [];
		for (let i = 0; i < text.length; i++) {
			out.push(text.substr(i, 1));
		}
		return out;
	}

	private generate(letters: string[], end: boolean): string[] {
		if (letters.length === 1) {
			return letters;
		}

		const closed = new Set<string>();
		const names = new PriorityQueue<Name>();
		const set = new Set(letters);
		for (const letter of set) {
			const lIndex = letters.indexOf(letter);
			const sub = this.letterClone(letters, lIndex);
			const subnames = this.generate(sub, false);
			for (const subname of subnames) {
				const optionA = letter + subname;
				if (! closed.has(optionA)) {
					closed.add(optionA);
					const rating = this.languageModel.rate(optionA);
					names.enq({name: optionA, prio: rating});
				}

				const optionB = subname + letter;
				if (! closed.has(optionB)) {
					closed.add(optionB);
					const rating = this.languageModel.rate(optionB, end);
					names.enq({name: optionB, prio: rating});
				}
			}
			if (end) {
				this.shrinkQueue(names, this.settings.numberOfNames);
			} else {
				this.shrinkQueue(names, this.settings.beamSize);
			}
		}
		let out: string[] = [];
		names.forEach( e => out.push(e.name));
		if (end) {
			out = out.map(s => s[0].toUpperCase() + s.slice(1).toLowerCase());
		}
		return out;
	}

	private letterClone(letters: string[], index: number): string[] {
		const clone = [];
		for (let i = 0; i < letters.length; i++) {
			if (i !== index) {
				clone.push(letters[i]);
			}
		}
		return clone;
	}

	private shrinkQueue(queue: PriorityQueue<any>, size: number) {
		while (queue.size() > size) {
			queue.deq();
		}
	}
}
