import { Component, OnInit } from '@angular/core';
import { GeneratorOptions } from '../../../../model/generator-options';
import { NameGenerator } from 'src/app/model/name-genrator';
import { ModelLoaderService } from '../../services/model-loader.service';
import { promise } from 'protractor';


@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
	private options: GeneratorOptions;
	names: string[];

	constructor(private loader: ModelLoaderService) {
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

	async generateNames(options: GeneratorOptions): Promise<void> {
		this.names = null;
		this.options = options;

		this.loader.subscribeToModel( model => {
			console.log('Init Generator');
			const generator = new NameGenerator(this.options, model);

			console.log('Start Name Generation');
			const t0 = performance.now();
			this.names = generator.runGenerator();
			const t1 = performance.now();
			console.log('Done');
			console.log('Generation took ' + (t1 - t0) + ' milliseconds.');
		});
	}
}
