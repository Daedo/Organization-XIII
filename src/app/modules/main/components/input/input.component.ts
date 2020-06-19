import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GeneratorOptions } from '../../../../model/generator-options';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { LanguageModelOptions } from 'src/app/model/language-model-options';

/**
 * The InputCompnent allows the user to configure the name generation and trigger it.
 */
@Component({
	selector: 'app-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

	// The generate emitter sends a message every thime the user kicks of the name generation with valid data.
	@Output()
	generate: EventEmitter<GeneratorOptions>;

	name = 'Sora';
	wordCount = 1;
	biWeight = 1.0;
	triWeight = 1.0;
	quadWeight = 1.0;
	numberOfNames = 30;
	beamSize = 30;
	sigil = 'X';
	backoff = true;

	constructor(private dialog: MatDialog) {
		this.generate = new EventEmitter();
	}

	ngOnInit(): void {
	}

	/**
	 * Checks if the input provided by the user is valid.
	 * Returns a list of all errors found. 
	 * If the input is valid this list will be empty.
	 */
	validateInput(): string[] {
		const out = [];

		if (this.name === null  || this.name.length === 0) {
			out.push('"Somebody Name" may not be empty.');
		}

		const wordCountError = this.validateInteger(this.wordCount, 'Words per Name', 1, 3);
		if (wordCountError !== null) {
			out.push(wordCountError);
		}

		const numberOfNamesError = this.validateInteger(this.numberOfNames, 'Number of Generated Names', 1, 100);
		if (numberOfNamesError !== null) {
			out.push(numberOfNamesError);
		}

		const beamSizeError = this.validateInteger(this.beamSize, 'Beam Size', 1, 100);
		if (beamSizeError !== null) {
			out.push(beamSizeError);
		}

		return out;
	}

	private validateInteger(value: number, name: string, lower: number, upper: number): string {
		if (value === null) {
			return '"' + name + '" may not be empty.';
		}
		if (!Number.isInteger(value)) {
			return '"' + name + '" must be an integer.';
		}
		if (value < lower || value > upper) {
			return '"' + name + '" must be between ' + lower + ' and ' + upper + '.';
		}
		return null;
	}

	/**
	 * Called when the user clicks on the button to generate the name.
	 * Triggers input validation.
	 * If the input is valid it triggers a generate event.
	 */
	kickoffGeneration(): void {
		const errors = this.validateInput();
		if (errors.length !== 0) {
			this.dialog.open(ErrorDialogComponent, {
				width: '250px',
				data: { errorMessage: errors }
			});
			return;
		}
		const langOptions = new LanguageModelOptions(this.biWeight, this.triWeight, this.quadWeight, this.backoff);
		const options = new GeneratorOptions(this.name, this.wordCount, this.numberOfNames, this.beamSize, this.sigil, langOptions);
		this.generate.emit(options);
	}


}
