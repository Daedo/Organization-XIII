export class GeneratorOptions {
	// tslint:disable: align
	constructor(public readonly name: string, public readonly wordCount: number,
				public readonly biWeight: number, public readonly triWeight: number,
				public readonly quadWeight: number, public readonly numberOfNames: number,
				public readonly beamSize: number, public readonly sigil: string,
				public readonly languageModel: string) {
	}
}
