import { GeneratorOptions } from './generator-options';
import { LanguageModel } from './language-model';
import * as PriorityQueue from 'priorityqueuejs';
import { ParsedModel } from './model';
import * as pc from 'punycode';
import { Map } from 'immutable';


/**
 * Utility functions to deal with unicode problems.
 */
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

/**
 * The NameGenerator class provides all functions necessary to generate an organization-13 name.
 */
export class NameGenerator {
	private languageModel: LanguageModel;

	/**
	 * Public constructor
	 * @param settings The parameters for the name generation, not null.
	 * @param model The langugage model for the name genreation, not null.
	 */
	constructor(private readonly settings: GeneratorOptions, model: ParsedModel) {
		this.languageModel = new LanguageModel(settings.modelOptions, model);
	}

	private static formatName(name: string): string {
		return name.split('-')
			.filter(s => s.length > 0)
			.map(s => s[0].toUpperCase() + s.slice(1).toLowerCase())
			.join('-');
	}

	private getLetters(text: string): string[] {
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

	/**
	 * Returns an generator object.
	 * Every next call of this generator produces a list of names with more and more letters.
	 * The final call returns the actual list of organization 13 names.
	 */
	public *getIterator(): Generator<string[], string[]>{
		// Create a collection of all letters (name, sigil, and word seperators).
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

		// Iteratively create names, adding one letter each iteration, yielding intermediate results
		let states = [this.getInitialState(letters)];
		while (!states[0].isFinished()) {
			yield states.map(s => NameGenerator.formatName(s.name));
			states = this.generateIteration(states);
		}

		// Return final result
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

	/**
	 * Single iteration of the beam search.
	 * @param states The current state objects at the start of the search.
	 */
	private generateIteration(states: State[]): State[] {
		// Queue for finding the most promissing names.
		const pQueue = new PriorityQueue<QueueNode>((a, b) => b.prio - a.prio);
		const isLastIteration = states[0].isFinalIteration();
		// Set to avoid duplicate name creations.
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

		// Beam-search part. After each iteration we only keep the "len" most promissing names.
		const len = isLastIteration ? this.settings.numberOfNames : this.settings.beamSize;
		const out = [];
		for (let i = 0; i < len; i++) {
			if (pQueue.isEmpty()) {
				break;
			}
			out.push(pQueue.deq().state);
		}
		// Referse, so the most promissing name is at the front.
		return out.reverse();
	}
}

interface QueueNode {
	prio: number;
	state: State;
}

/**
 * An object that represents an intermediate state of a name.
 */
class State {
	/**
	 * Public constructor
	 * @param name the current name, generated so far, not null.
	 * @param remainingLetters the remaining letters to be added to this name, not null.
	 */
	constructor(public readonly name: string, public readonly remainingLetters: Map<string, number>) {}

	private static getUpdate(map: Map<string, number>, key: string) {
		const val = map.get(key);
		if (val > 1) {
			return map.set(key, val - 1);
		}
		return map.remove(key);
	}

	/**
	 * Returns true if only one letter is left to be added.
	 */
	public isFinalIteration(): boolean {
		if (this.remainingLetters.size > 1) {
			return false;
		}
		const key = this.remainingLetters.keys().next().value;
		return this.remainingLetters.get(key) === 1;
	}

	/**
	 * Returns true if no letters are to be added.
	 */
	public isFinished(): boolean {
		return this.remainingLetters.isEmpty();
	}

	/**
	 * Generate all possible state reachable from adding a remaining letter at the front or back of the current name.
	 */
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
