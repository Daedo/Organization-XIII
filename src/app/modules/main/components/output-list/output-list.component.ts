import { Component, OnInit, Input } from '@angular/core';

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
