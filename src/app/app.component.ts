import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'Organization-XIII';

	navLinks = [
		{label: 'Get Edgy!', path: 'XIII'},
		{label: 'About', path: 'about'},
	];
}
