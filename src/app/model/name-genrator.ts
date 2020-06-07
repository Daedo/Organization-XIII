import { GeneratorOptions } from './generator-options';

export class NameGenerator {
	constructor(private readonly settings: GeneratorOptions) {}

	public runGenerator(): string[] {
		// TODO Generate
		return ['Test', 'Test2', 'Test3'];
	}
}
