import { Component, OnInit } from '@angular/core';
import * as sections from '../../../../../assets/about.json';

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
