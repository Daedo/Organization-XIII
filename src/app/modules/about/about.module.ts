import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './components/about/about.component';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import { RepoLinkPipe } from './pipes/repo-link.pipe';

@NgModule({
	declarations: [AboutComponent, RepoLinkPipe],
	imports: [
		CommonModule,
		MatCardModule,
		MatDividerModule,
		MatExpansionModule
	]
})
export class AboutModule { }
