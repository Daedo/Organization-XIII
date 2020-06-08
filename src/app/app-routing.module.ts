import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './modules/main/components/main/main.component';
import { AboutComponent } from './modules/about/components/about/about.component';


const routes: Routes = [
	{ path: 'XIII', component: MainComponent },
	{ path: 'about', component: AboutComponent },
	{ path: '', redirectTo: 'XIII', pathMatch: 'full'}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
