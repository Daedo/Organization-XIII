import { Component, OnInit } from '@angular/core';
import * as sections from '../../../../../assets/about.json';

/**
 * The about component reads the data from the about.json and displays it at the about page.
 */
@Component({
	selector: 'app-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
	// @ts-ignore
	readonly aboutSections = sections.default;

	constructor() {}

	ngOnInit(): void {}

}
