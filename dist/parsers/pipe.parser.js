"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const translation_collection_1 = require("../utils/translation.collection");
const utils_1 = require("../utils/utils");
class PipeParser {
    extract(template, path, relativePath) {
        if (path && utils_1.isPathAngularComponent(path)) {
            template = utils_1.extractComponentInlineTemplate(template);
        }
        return this.parseTemplate(template, relativePath);
    }
    parseTemplate(template, relativePath) {
        let collection = new translation_collection_1.TranslationCollection();
        const regExp = /(['"`])((?:(?!\1).|\\\1)+)\1\s*\|\s*translate\s*(:.*:.*:?.*')?/g;
        let matches;
        while (matches = regExp.exec(template)) {
            let context = '';
            let comment = null;
            if (matches[3]) {
                const splParams = matches[3].split(':');
                if (splParams[2]) {
                    context = splParams[2].slice(1, splParams[2].length - 1);
                }
                if (splParams[3]) {
                    comment = splParams[3].slice(1, splParams[3].length - 1);
                }
            }
            let key = matches[2].split('\\\'').join('\'');
            if (context) {
                if (key.startsWith(context)) {
                    key = key.slice(context.length + 1);
                }
                else {
                    throw new Error(`Key "${key}" have to start with "${context}" because you set a context.`);
                }
            }
            collection = collection.add(key, { value: '', reference: relativePath, context: context, comment: comment });
        }
        return collection;
    }
}
exports.PipeParser = PipeParser;
//# sourceMappingURL=pipe.parser.js.map