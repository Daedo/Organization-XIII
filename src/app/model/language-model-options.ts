export class LanguageModelOptions {
	// tslint:disable: align
	constructor(public readonly biWeight: number, public readonly triWeight: number,
				public readonly quadWeight: number, public readonly nGramBackoff: boolean) {
	}
}
