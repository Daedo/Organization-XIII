import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { InputComponent } from './components/input/input.component';
import { OutputListComponent } from './components/output-list/output-list.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component'
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
	declarations: [MainComponent, InputComponent, OutputListComponent, LoadingComponent, ErrorDialogComponent],
	imports: [
		CommonModule,
		FormsModule,
		MatInputModule,
		MatExpansionModule,
		MatSliderModule,
		MatDialogModule,
		MatSelectModule,
		MatProgressBarModule,
		MatListModule,
		MatCardModule,
		MatSlideToggleModule,
		MatTooltipModule
	]
})
export class MainModule { }
