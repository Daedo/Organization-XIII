import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Model, ParsedModel } from 'src/app/model/model';
import { BehaviorSubject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

/**
 * The model load service is used to asynchroniously load the langauge model.
 * This helps to reduce the first load of the application.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelLoaderService {
	private subject: BehaviorSubject<ParsedModel>;
	constructor(private http: HttpClient) {
		this.subject = new BehaviorSubject(null);
		this.load();
	}

	/**
	 * Triggers the loading. If the http requests fails it automatically tries again.
	 */
	private load(): void {
		console.log('Start Loading Model');

		this.http.get('./assets/english-model.json').subscribe( model => {
			console.log('Start Parsing Model');
			this.parseModel(model as Model);
		}, error => {
			console.log('Error:');
			console.log(error);
			this.load();
		});
	}

	/**
	 * Wait for a language model to be present.
	 * @param callback  If the model was loaded or if the model is already present the callback will be executed.
	 */
	public subscribeToModel(callback: (ParsedModel) => any) {
		this.subject
			.pipe(filter( m => m !== null))
			.pipe(take(1))
			.subscribe(callback);
	}

	private parseModel(model: Model) {
		const monograms = new Map();
		this.fill(monograms, model.monograms);

		const bigrams = new Map();
		this.fill(bigrams, model.bigrams);

		const trigrams = new Map();
		this.fill(trigrams, model.trigrams);

		const quadgrams = new Map();
		this.fill(quadgrams, model.quadgrams);
		const parsedModel = [monograms, bigrams, trigrams, quadgrams];
		this.subject.next(parsedModel);
	}

	private fill(map: Map<string, number>, gData: any) {
		for (const gram in gData) {
			if (gData.hasOwnProperty(gram)) {
				const value = gData[gram];
				map.set(gram, value);
			}
		}
	}
}
