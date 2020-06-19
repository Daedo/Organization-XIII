/**
 * The LanguageModelOptions class is a pure data-class, that keeps the parameters of a LanguageModel.
 */
export class LanguageModelOptions {
	// tslint:disable: align
	constructor(public readonly biWeight: number, public readonly triWeight: number,
				public readonly quadWeight: number, public readonly nGramBackoff: boolean) {
	}
}
