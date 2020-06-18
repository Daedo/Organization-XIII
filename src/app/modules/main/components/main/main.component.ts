import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { GeneratorOptions } from '../../../../model/generator-options';
import { NameGenerator } from 'src/app/model/name-genrator';
import { ModelLoaderService } from '../../services/model-loader.service';


@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewChecked {
	private options: GeneratorOptions;
	names: string[];
	intermediateResults: IteratorResult<string[], string[]>;
	private updateDone: boolean;
	private currentGenerator: Generator<string[], string[], boolean>;

	constructor(private loader: ModelLoaderService) {
		this.options = null;
		this.names = null;
		this.intermediateResults = null;
		this.currentGenerator = null;
		this.updateDone = true;
	}

	ngOnInit(): void {
	}

	get isLoading(): boolean {
		// We have options but we don't yet have the final results.
		return !this.updateDone;
	}

	get hasOutput(): boolean {
		return this.names !== null;
	}

	ngAfterViewChecked(): void {
		if (!this.updateDone) {
			setTimeout(() => {
				this.intermediateResults = this.currentGenerator.next();
				this.updateDone = this.intermediateResults.done;
				this.names = this.intermediateResults.value;
			});
		}
	}

	generateNames(options: GeneratorOptions): void {
		this.names = null;
		this.intermediateResults = null;
		this.updateDone = true;
		this.options = options;

		console.log('Subscribe To Model');
		this.loader.subscribeToModel( model => {
			console.log('Init Generator');
			const generator = new NameGenerator(this.options, model);
			this.currentGenerator = generator.getIterator();
			this.intermediateResults = this.currentGenerator.next();
			this.updateDone = this.intermediateResults.done;
			this.names = this.intermediateResults.value;
		});
	}
}
