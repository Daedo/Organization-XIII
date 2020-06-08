import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './components/about/about.component';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';


@NgModule({
	declarations: [AboutComponent],
	imports: [
		CommonModule,
		MatCardModule,
		MatDividerModule
	]
})
export class AboutModule { }
