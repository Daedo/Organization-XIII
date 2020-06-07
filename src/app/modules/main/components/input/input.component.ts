import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GeneratorOptions } from '../../../../model/generator-options';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
	selector: 'app-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

	@Output()
	generate: EventEmitter<GeneratorOptions>;

	name = 'Sora';
	wordCount = 1;
	biWeight = 1.0;
	triWeight = 1.0;
	quadWeight = 1.0;
	numberOfNames = 15;
	beamSize = 15;
	sigil = 'X';
	languageModel = 'english';

	constructor(private dialog: MatDialog) {
		this.generate = new EventEmitter();
	}

	ngOnInit(): void {
	}

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

	updateOptions(): void {
		const errors = this.validateInput();
		if (errors.length !== 0) {
			this.dialog.open(ErrorDialogComponent, {
				width: '250px',
				data: { errorMessage: errors }
			});
			return;
		}
		const options = new GeneratorOptions(this.name, this.wordCount, this.biWeight, this.triWeight, this.quadWeight,
											this.numberOfNames, this.beamSize, this.sigil, this.languageModel);
		this.generate.emit(options);
	}


}
