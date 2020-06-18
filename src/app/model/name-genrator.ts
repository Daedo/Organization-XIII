import { GeneratorOptions } from './generator-options';
import { LanguageModel } from './language-model';
import * as PriorityQueue from 'priorityqueuejs';
import { ParsedModel } from './model';
import * as pc from 'punycode';
import { Map } from 'immutable';

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

	public *getIterator(): Generator<string[], string[]>{
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

		let states = [this.getInitialState(letters)];
		while (!states[0].isFinished()) {
			yield states.map(s => NameGenerator.formatName(s.name));
			states = this.generateIteration(states);
		}

		return states.map(s => NameGenerator.formatName(s.name));
	}

	private getInitialState(letters: string[]): State {
		const counts = {};
		for (const letter of letters) {
			counts[letter] = counts[letter] ? counts[letter] + 1 : 1;
		}
		const map = Map(counts) as Map<string, number>;
		return new State('', map);
	}

	private generateIteration(states: State[]): State[] {
		const pQueue = new PriorityQueue<QueueNode>((a, b) => b.prio - a.prio);
		const isLastIteration = states[0].isFinalIteration();
		const closed = new Set<string>();
		for (const state of states) {
			const updated = state.getIteratedStates();
			for (const update of updated) {
				if (!closed.has(update.name)) {
					const rating = this.languageModel.rate(update.name, isLastIteration);
					pQueue.enq({state: update, prio: rating});
					closed.add(update.name);
				}
			}
		}

		const len = isLastIteration ? this.settings.numberOfNames : this.settings.beamSize;
		const out = [];
		for (let i = 0; i < len; i++) {
			if (pQueue.isEmpty()) {
				break;
			}
			out.push(pQueue.deq().state);
		}
		return out.reverse();
	}
}

interface QueueNode {
	prio: number;
	state: State;
}

class State {
	constructor(public readonly name: string, public readonly remainingLetters: Map<string, number>) {}

	private static getUpdate(map: Map<string, number>, key: string) {
		const val = map.get(key);
		if (val > 1) {
			return map.set(key, val - 1);
		}
		return map.remove(key);
	}

	public isFinalIteration(): boolean {
		if (this.remainingLetters.size > 1) {
			return false;
		}
		const key = this.remainingLetters.keys().next().value;
		return this.remainingLetters.get(key) === 1;
	}

	public isFinished(): boolean {
		return this.remainingLetters.isEmpty();
	}

	public getIteratedStates(): State[] {
		const out: State[] = [];
		for (const key of this.remainingLetters.keys()) {
			const updatedState = State.getUpdate(this.remainingLetters, key);
			out.push(new State(key + this.name, updatedState));
			out.push(new State(this.name + key, updatedState));
		}
		return out;
	}
}
