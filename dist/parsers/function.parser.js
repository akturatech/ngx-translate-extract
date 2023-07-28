"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = require("typescript");
const abstract_ast_parser_1 = require("./abstract-ast.parser");
const translation_collection_1 = require("../utils/translation.collection");
class FunctionParser extends abstract_ast_parser_1.AbstractAstParser {
    constructor(options) {
        super();
        this.functionIdentifier = 'marker';
        if (options && typeof options.identifier !== 'undefined') {
            this.functionIdentifier = options.identifier;
        }
    }
    extract(template, path, relativePath) {
        let collection = new translation_collection_1.TranslationCollection();
        this.sourceFile = this.createSourceFile(path, template);
        const callNodes = this.findCallNodes();
        callNodes.forEach(callNode => {
            let keys = this.getStringLiterals(callNode, 0);
            const contextArr = this.getStringLiterals(callNode, 1);
            const commentArr = this.getStringLiterals(callNode, 2);
            const context = contextArr.length ? contextArr[0] : '';
            const comment = commentArr.length ? commentArr[0] : null;
            if (context) {
                keys = keys.map(key => key.startsWith(context) ? key.slice(context.length + 1) : key);
            }
            if (keys && keys.length) {
                collection = collection.addKeys(keys, keys.map(key => { return { value: '', reference: relativePath, context: context, comment: comment }; }));
            }
        });
        return collection;
    }
    findCallNodes(node) {
        if (!node) {
            node = this.sourceFile;
        }
        let callNodes = this.findNodes(node, typescript_1.SyntaxKind.CallExpression);
        callNodes = callNodes
            .filter(callNode => {
            if (callNode.arguments.length < 1) {
                return false;
            }
            const identifier = callNode.getChildAt(0).text;
            if (identifier !== this.functionIdentifier) {
                return false;
            }
            return true;
        });
        return callNodes;
    }
}
exports.FunctionParser = FunctionParser;
//# sourceMappingURL=function.parser.js.map