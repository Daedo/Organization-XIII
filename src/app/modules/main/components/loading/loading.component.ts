import { Component, OnInit } from '@angular/core';
import * as data from '../../../../../assets/loading-texts.json';

/**
 * The LoadingComponent displays a loading bar, with a random text, picked from the loading-texts.json.
 */
@Component({
	selector: 'app-loading',
	templateUrl: './loading.component.html',
	styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
	// @ts-ignore
	private static readonly messages: string[] = data.default;
	message: string;

	constructor() {}

	/**
	 * Returns a random integer between min (inclusive) and max (inclusive).
	 * The value is no lower than min (or the next integer greater than min
	 * if min isn't an integer) and no greater than max (or the next integer
	 * lower than max if max isn't an integer).
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	private static getRandomInt(min: number, max: number): number {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	ngOnInit(): void {
		const messages = LoadingComponent.messages.length - 1;
		const index = LoadingComponent.getRandomInt(0, messages);
		this.message = LoadingComponent.messages[index];
	}
}
