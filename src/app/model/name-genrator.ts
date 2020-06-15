import { GeneratorOptions } from './generator-options';
import { LanguageModel } from './language-model';
import * as PriorityQueue from 'priorityqueuejs';
import { ParsedModel } from './model';
import * as pc from 'punycode';

// @ts-ignore
const punycode = pc.default;


const symbolRegex = /(\P{M})(\p{M})*/gu;
const decodeStripped = (s: string) => {
	// Remove any combining marks, leaving only the symbols they belong to:
	const stripped = s.replace(symbolRegex, ($0, symbol, combiningMarks) => {
		return symbol;
	});
	// Account for astral symbols / surrogates, just like we did before:
	return punycode.ucs2.decode(stripped);
};

interface Name {
	prio: number;
	name: string;
}

export class NameGenerator {
	private languageModel: LanguageModel;

	constructor(private readonly settings: GeneratorOptions, model: ParsedModel) {
		this.languageModel = new LanguageModel(settings.modelOptions, model);
	}

	private static formatName(name: string): string {
		return name.split('-')
			.filter(s => s.length > 0)
			.map(s => s[0].toUpperCase() + s.slice(1).toLowerCase())
			.join('-');
	}

	public runGenerator(): string[] {
		const name = this.settings.name.toUpperCase();
		let sigil = this.settings.sigil;
		if (sigil === null || sigil === undefined) {
			sigil = '';
		}
		sigil = sigil.toUpperCase();
		const letters = [].concat(this.getLetters(name), this.getLetters(sigil));
		for (let i = 0; i < this.settings.wordCount - 1; i++) {
			letters.push('-');
		}

		return this.generate(letters, true);
	}

	public getLetters(text: string): string[] {
		const out: string[] = decodeStripped(text)
				.map(c => punycode.ucs2.encode([c]));

		// Deal with skintone modifiers
		for (let i = out.length - 1; i > 0; i--) {
			if (out[i].charCodeAt(0) === 0xD83C) {
				if (out[i].charCodeAt(1) >= 0xDFFB || out[i].charCodeAt(1) <= 0xDFFF) {
					out[i - 1] += out[i];
					out.splice(i, 1);
				}
			}
		}
		return out;
	}

	private generate(letters: string[], end: boolean): string[] {
		if (letters.length === 1) {
			return letters;
		}

		const closed = new Set<string>();
		const names = new PriorityQueue<Name>((a, b) => a.prio - b.prio);
		const set = new Set(letters);
		for (const letter of set) {
			const lIndex = letters.indexOf(letter);
			const sub = this.letterClone(letters, lIndex);
			const subnames = this.generate(sub, false);
			for (const subname of subnames) {
				const optionA = letter + subname;
				if (! closed.has(optionA)) {
					closed.add(optionA);
					const rating = this.languageModel.rate(optionA, end);
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
			out = out.reverse() // Order by decreasing pronouncabillity
					.map(NameGenerator.formatName); // Capitalize
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
