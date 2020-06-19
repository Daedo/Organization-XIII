import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { GeneratorOptions } from '../../../../model/generator-options';
import { NameGenerator } from 'src/app/model/name-genrator';
import { ModelLoaderService } from '../../services/model-loader.service';


/**
 * The MainComponent controls the main functionality of the software.
 * Most of the name Generation is triggered here.
 */
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

	/**
	 * Returns true if we are currently running iterations.
	 */
	get isLoading(): boolean {
		return !this.updateDone;
	}

	/**
	 * Returns true if we have intermediate or final results.
	 */
	get hasOutput(): boolean {
		return this.names !== null;
	}

	ngAfterViewChecked(): void {
		if (!this.updateDone) {
			// We compute a new name generation iteration.
			// At the end of each iteration we update the names variable.
			// This leads to an update of the output-list component, since names is bound to its input.
			// After the output-list has updated another ngAfterViewChecked is called, with then runs the next update.
			// This is repeated until the updateDone flag is set to true (i.e. all names have been generated).
			setTimeout(() => {
				this.intermediateResults = this.currentGenerator.next();
				this.updateDone = this.intermediateResults.done;
				this.names = this.intermediateResults.value;
			});
		}
	}

	/**
	 * Triggered when the user clicks the name gernation button. Kicks of the name generation process.
	 * @param options The parameters for the name generator.
	 */
	generateNames(options: GeneratorOptions): void {
		// Reset all the values.
		this.names = null;
		this.intermediateResults = null;
		this.updateDone = true;
		this.options = options;

		// We might have to wait for the language model to be loaded.
		console.log('Subscribe To Model');
		this.loader.subscribeToModel( model => {
			// Now we setup the gernator.
			console.log('Init Generator');
			const generator = new NameGenerator(this.options, model);
			this.currentGenerator = generator.getIterator();
			this.intermediateResults = this.currentGenerator.next();
			this.updateDone = this.intermediateResults.done;
			this.names = this.intermediateResults.value;
		});
	}
}
