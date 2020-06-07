import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
	errorMessage: string[];
}

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
