import { SourceFile, CallExpression, Node, SyntaxKind } from 'typescript';
export declare abstract class AbstractAstParser {
    protected sourceFile: SourceFile;
    protected createSourceFile(path: string, contents: string): SourceFile;
    protected getStringLiterals(callNode: CallExpression, argumentNumber?: number): string[];
    protected findNodes(node: Node, kind: SyntaxKind): Node[];
}
