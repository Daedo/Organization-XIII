export interface Model {
	monograms: any;
	bigrams: any;
	trigrams: any;
	quadgrams: any;
}

export type ParsedModel =  Map<string, number>[];
