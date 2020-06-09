import { Component, OnInit } from '@angular/core';
import * as sections from '../../../../model/data/about.json';

@Component({
	selector: 'app-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
	// @ts-ignore
	readonly aboutSections = sections.default;

	constructor() {
		console.dir(this.aboutSections);
	}

	ngOnInit(): void {
	}

}
