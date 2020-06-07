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

  name: string = "Sora";
  wordCount: number = 1;
  biWeight: number = 1.0;
  triWeight: number = 1.0;
  quadWeight: number = 1.0;
  beamSize: number = 15;
  sigil: string = "X";

  constructor(private dialog: MatDialog) { 
    this.generate = new EventEmitter();
  }

  ngOnInit(): void {
  }

  startNorting(): void {
    // TODO Input Validation
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '250px',
      data: {errorMessage: "Not Edgy enough!"}
    });
    // TODO if there was an error: abort
    const options = new GeneratorOptions(this.name, this.wordCount, this.biWeight, this.triWeight, this.quadWeight, this.beamSize, this.sigil);
    this.generate.emit(options);
  }


}
