import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
export declare class PipeParser implements ParserInterface {
    extract(template: string, path: string, relativePath?: string): TranslationCollection;
    protected parseTemplate(template: string, relativePath: string): TranslationCollection;
}
