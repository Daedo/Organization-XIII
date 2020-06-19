import { LanguageModelOptions } from './language-model-options';

/**
 * The GeneratorOptions class is a pure data-class that keeps the parameters of a NameGenerator.
 */
export class GeneratorOptions {
	// tslint:disable: align
	constructor(public readonly name: string, public readonly wordCount: number,
				public readonly numberOfNames: number, public readonly beamSize: number,
				public readonly sigil: string, public readonly modelOptions: LanguageModelOptions) {
	}
}
