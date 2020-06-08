import { Component, OnInit } from '@angular/core';
import { GeneratorOptions } from '../../../../model/generator-options';
import { NameGenerator } from 'src/app/model/name-genrator';


@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
	private options: GeneratorOptions;
	names: string[];

	constructor() {
		this.options = null;
		this.names = null;
	}

	ngOnInit(): void {
	}

	get isLoading(): boolean {
		// We have options but we don't yet have results.
		return this.options !== null && this.names === null;
	}

	get hasOutput(): boolean {
		return this.names !== null;
	}

	generateNames(options: GeneratorOptions): void {
		this.names = null;
		this.options = options;

		// Send the generator to the worker
		const generator = new NameGenerator(this.options);
		setTimeout( () => {
			console.log('Start Name Generation');
			this.names = generator.runGenerator();
			console.log('Done');
			console.log(this.names);
		});
	}
}
