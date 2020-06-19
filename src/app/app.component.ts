import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

/**
 * The AppComponent is the main UI component. Displays the navbar.
 */
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'Organization-XIII';

	/**
	 * The links in the navbar.
	 */
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
