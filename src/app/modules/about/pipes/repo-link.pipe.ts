import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
	name: 'repoLink'
})
export class RepoLinkPipe implements PipeTransform {
	constructor(private domSanitizer: DomSanitizer) {}

	private static readonly repoLink = 'https://github.com/Daedo/Organization-XIII/';

	private static addRepoLinks(text: string): string {
		return text.replace(/GitHub( page)?/, '$&'.link(this.repoLink));
	}

	transform(value: any, ...args: unknown[]): unknown {
		return this.domSanitizer.bypassSecurityTrustHtml(RepoLinkPipe.addRepoLinks(value));
	}
}
