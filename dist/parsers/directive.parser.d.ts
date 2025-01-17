import { ParserInterface } from './parser.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { TmplAstNode, TmplAstElement } from '@angular/compiler';
export declare class DirectiveParser implements ParserInterface {
    extract(template: string, path: string, relativePath?: string): TranslationCollection;
    protected getTranslatableElements(nodes: TmplAstNode[]): TmplAstElement[];
    protected findChildrenElements(node: TmplAstNode): TmplAstElement[];
    protected parseTemplate(template: string, path: string): TmplAstNode[];
    protected isElement(node: any): node is TmplAstElement;
    protected isTranslatable(node: TmplAstNode): boolean;
    protected getElementTranslateAttrValue(element: TmplAstElement): string;
    protected getElementTranslateContextAttrValue(element: TmplAstElement): string;
    protected getElementTranslateCommentAttrValue(element: TmplAstElement): string;
    protected getElementContents(element: TmplAstElement): string;
}
