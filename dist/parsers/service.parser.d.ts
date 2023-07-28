import { SourceFile, Node, ConstructorDeclaration, ClassDeclaration, CallExpression } from 'typescript';
import { ParserInterface } from './parser.interface';
import { AbstractAstParser } from './abstract-ast.parser';
import { TranslationCollection } from '../utils/translation.collection';
export declare class ServiceParser extends AbstractAstParser implements ParserInterface {
    protected sourceFile: SourceFile;
    extract(template: string, path: string, relativePath?: string): TranslationCollection;
    protected findTranslateServicePropertyName(constructorNode: ConstructorDeclaration): string;
    protected findClassNodes(node: Node): ClassDeclaration[];
    protected findConstructorNode(node: ClassDeclaration): ConstructorDeclaration;
    protected findCallNodes(node: Node, propertyIdentifier: string): CallExpression[];
}
