"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const translation_collection_1 = require("../utils/translation.collection");
const utils_1 = require("../utils/utils");
const compiler_1 = require("@angular/compiler");
class DirectiveParser {
    extract(template, path, relativePath) {
        if (path && utils_1.isPathAngularComponent(path)) {
            template = utils_1.extractComponentInlineTemplate(template);
        }
        let collection = new translation_collection_1.TranslationCollection();
        const nodes = this.parseTemplate(template, path);
        this.getTranslatableElements(nodes).forEach(element => {
            let key = this.getElementTranslateAttrValue(element) || this.getElementContents(element);
            const context = this.getElementTranslateContextAttrValue(element);
            const comment = this.getElementTranslateCommentAttrValue(element);
            if (context) {
                if (key.startsWith(context)) {
                    key = key.slice(context.length + 1);
                }
                else {
                    throw new Error(`Key "${key}" have to start with "${context}" because you set a context.`);
                }
            }
            collection = collection.add(key, { value: '', reference: relativePath, context: context, comment: comment });
        });
        return collection;
    }
    getTranslatableElements(nodes) {
        return nodes
            .filter(element => this.isElement(element))
            .reduce((result, element) => {
            return result.concat(this.findChildrenElements(element));
        }, [])
            .filter(element => this.isTranslatable(element));
    }
    findChildrenElements(node) {
        if (!this.isElement(node)) {
            return [];
        }
        if (this.isTranslatable(node)) {
            return [node];
        }
        return node.children.reduce((result, childNode) => {
            if (this.isElement(childNode)) {
                const children = this.findChildrenElements(childNode);
                return result.concat(children);
            }
            return result;
        }, [node]);
    }
    parseTemplate(template, path) {
        return compiler_1.parseTemplate(template, path).nodes;
    }
    isElement(node) {
        return node
            && node.attributes !== undefined
            && node.children !== undefined;
    }
    isTranslatable(node) {
        if (this.isElement(node) && node.attributes.some(attribute => attribute.name === 'translate')) {
            return true;
        }
        return false;
    }
    getElementTranslateAttrValue(element) {
        const attr = element.attributes.find(attribute => attribute.name === 'translate');
        return attr && attr.value || '';
    }
    getElementTranslateContextAttrValue(element) {
        const attr = element.attributes.find(attribute => attribute.name === 'translate-context');
        return attr && attr.value || '';
    }
    getElementTranslateCommentAttrValue(element) {
        const attr = element.attributes.find(attribute => attribute.name === 'translate-comment');
        return attr && attr.value || '';
    }
    getElementContents(element) {
        const contents = element.sourceSpan.start.file.content;
        const start = element.startSourceSpan.end.offset;
        const end = element.endSourceSpan.start.offset;
        return contents.substring(start, end).trim();
    }
}
exports.DirectiveParser = DirectiveParser;
//# sourceMappingURL=directive.parser.js.map