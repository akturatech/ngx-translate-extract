import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { isPathAngularComponent, extractComponentInlineTemplate } from '../utils/utils';

export class PipeParser implements ParserInterface {

	public extract(template: string, path: string, relativePath?: string): TranslationCollection {
		if (path && isPathAngularComponent(path)) {
			template = extractComponentInlineTemplate(template);
		}

		return this.parseTemplate(template, relativePath);
	}

	protected parseTemplate(template: string, relativePath: string): TranslationCollection {
		let collection: TranslationCollection = new TranslationCollection();

		const regExp = /(['"`])((?:(?!\1).|\\\1)+)\1\s*\|\s*translate\s*(:.*:.*:?.*')?/g;
		let matches: RegExpExecArray;
		while (matches = regExp.exec(template)) {
			let context = '';
			let comment = null;

			if ( matches[ 3 ] ) {
             const splParams = matches[3].split(':');

             if ( splParams[ 2 ] ) {
							context = splParams[2].trim();
							context = context.slice(1, context.length - 1);
			 }

             if ( splParams[ 3 ] ) {
							comment = splParams[3].trim();
							comment = comment.slice(1, comment.length - 1);
			 }
			}

			let key = matches[2].split('\\\'').join('\'');

			if ( context ) {
				if ( key.startsWith( context ) ) {
					key = key.slice( context.length + 1 );
				} else {
					throw new Error( `Key "${key}" have to start with "${context}" because you set a context.` );
				}
			}

			collection = collection.add( key, { value: '', reference: relativePath, context: context, comment: comment } );
		}

		return collection;
	}

}
