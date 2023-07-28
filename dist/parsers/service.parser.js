"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = require("typescript");
const abstract_ast_parser_1 = require("./abstract-ast.parser");
const translation_collection_1 = require("../utils/translation.collection");
class ServiceParser extends abstract_ast_parser_1.AbstractAstParser {
    extract(template, path, relativePath) {
        let collection = new translation_collection_1.TranslationCollection();
        this.sourceFile = this.createSourceFile(path, template);
        const classNodes = this.findClassNodes(this.sourceFile);
        classNodes.forEach(classNode => {
            const constructorNode = this.findConstructorNode(classNode);
            if (!constructorNode) {
                return;
            }
            const propertyName = this.findTranslateServicePropertyName(constructorNode);
            if (!propertyName) {
                return;
            }
            const callNodes = this.findCallNodes(classNode, propertyName);
            callNodes.forEach(callNode => {
                const keys = this.getStringLiterals(callNode);
                if (keys && keys.length) {
                    collection = collection.addKeys(keys, keys.map(key => { return { value: '', context: '', reference: relativePath }; }));
                }
            });
        });
        return collection;
    }
    findTranslateServicePropertyName(constructorNode) {
        if (!constructorNode) {
            return null;
        }
        const result = constructorNode.parameters.find(parameter => {
            if (!parameter.modifiers) {
                return false;
            }
            if (!parameter.type) {
                return false;
            }
            const parameterType = parameter.type.typeName;
            if (!parameterType) {
                return false;
            }
            const className = parameterType.text;
            if (className !== 'TranslateService') {
                return false;
            }
            return true;
        });
        if (result) {
            return result.name.text;
        }
    }
    findClassNodes(node) {
        return this.findNodes(node, typescript_1.SyntaxKind.ClassDeclaration);
    }
    findConstructorNode(node) {
        const constructorNodes = this.findNodes(node, typescript_1.SyntaxKind.Constructor);
        if (constructorNodes) {
            return constructorNodes[0];
        }
    }
    findCallNodes(node, propertyIdentifier) {
        let callNodes = this.findNodes(node, typescript_1.SyntaxKind.CallExpression);
        callNodes = callNodes
            .filter(callNode => {
            if (callNode.arguments.length < 1) {
                return false;
            }
            const propAccess = callNode.getChildAt(0).getChildAt(0);
            if (!propAccess || !typescript_1.isPropertyAccessExpression(propAccess)) {
                return false;
            }
            if (!propAccess.getFirstToken() || propAccess.getFirstToken().kind !== typescript_1.SyntaxKind.ThisKeyword) {
                return false;
            }
            if (propAccess.name.text !== propertyIdentifier) {
                return false;
            }
            const methodAccess = callNode.getChildAt(0);
            if (!methodAccess || methodAccess.kind !== typescript_1.SyntaxKind.PropertyAccessExpression) {
                return false;
            }
            if (!methodAccess.name || (methodAccess.name.text !== 'get' && methodAccess.name.text !== 'instant' && methodAccess.name.text !== 'stream')) {
                return false;
            }
            return true;
        });
        return callNodes;
    }
}
exports.ServiceParser = ServiceParser;
//# sourceMappingURL=service.parser.js.map