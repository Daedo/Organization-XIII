import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'Organization-XIII';

	navLinks = [
		{ label: 'Get Edgy!', path: 'XIII' },
		{ label: 'About', path: 'about' },
	];

	constructor(
		private matIconRegistry: MatIconRegistry,
		private domSanitizer: DomSanitizer
	) {
		this.matIconRegistry.addSvgIcon(
			'github',
			this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/github-logo.svg')
		);
	}
}
