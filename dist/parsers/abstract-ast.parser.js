"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = require("typescript");
class AbstractAstParser {
    createSourceFile(path, contents) {
        return typescript_1.createSourceFile(path, contents, null, false);
    }
    getStringLiterals(callNode, argumentNumber = 0) {
        if (!callNode.arguments.length || callNode.arguments.length - 1 < argumentNumber) {
            return [];
        }
        const firstArg = callNode.arguments[argumentNumber];
        return this.findNodes(firstArg, typescript_1.SyntaxKind.StringLiteral)
            .map((node) => node.text);
    }
    findNodes(node, kind) {
        const childrenNodes = node.getChildren(this.sourceFile);
        const initialValue = node.kind === kind ? [node] : [];
        return childrenNodes.reduce((result, childNode) => {
            return result.concat(this.findNodes(childNode, kind));
        }, initialValue);
    }
}
exports.AbstractAstParser = AbstractAstParser;
//# sourceMappingURL=abstract-ast.parser.js.map