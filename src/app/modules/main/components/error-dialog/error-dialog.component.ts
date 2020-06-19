import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
	errorMessage: string[];
}

/**
 * The ErrorDialogComponent is an angular material diaglog used to display an error message,
 * when the user tries to trigger the name generation with invalid date.
 */
@Component({
	selector: 'app-error-dialog',
	templateUrl: './error-dialog.component.html',
	styleUrls: ['./error-dialog.component.css']
})
export class ErrorDialogComponent implements OnInit {

	errorMessages: string[];
	constructor(
		public dialogRef: MatDialogRef<ErrorDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData) {
		this.errorMessages = data.errorMessage;

	}

	ngOnInit(): void {
	}

	close(): void {
		this.dialogRef.close();
	}

}
