import { Node, CallExpression } from 'typescript';
import { ParserInterface } from './parser.interface';
import { AbstractAstParser } from './abstract-ast.parser';
import { TranslationCollection } from '../utils/translation.collection';
export declare class FunctionParser extends AbstractAstParser implements ParserInterface {
    protected functionIdentifier: string;
    constructor(options?: any);
    extract(template: string, path: string, relativePath?: string): TranslationCollection;
    protected findCallNodes(node?: Node): CallExpression[];
}
