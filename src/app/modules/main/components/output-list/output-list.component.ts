import { Component, OnInit, Input } from '@angular/core';

/**
 * The OutputListComponent is used to display a list of intermediate/final names.
 */
@Component({
	selector: 'app-output-list',
	templateUrl: './output-list.component.html',
	styleUrls: ['./output-list.component.scss']
})
export class OutputListComponent implements OnInit {

	@Input()
	names: string[];

	constructor() { }

	ngOnInit(): void {
	}

}
