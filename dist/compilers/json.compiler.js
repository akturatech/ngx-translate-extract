"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const translation_collection_1 = require("../utils/translation.collection");
const utils_1 = require("../utils/utils");
class JsonCompiler {
    constructor(options) {
        this.indentation = '\t';
        this.extension = 'json';
        if (options && typeof options.indentation !== 'undefined') {
            this.indentation = options.indentation;
        }
    }
    compile(collection) {
        const values = {};
        Object.keys(collection.values).forEach(contextKey => {
            Object.keys(collection.values[contextKey]).forEach(key => {
                const data = collection.values[contextKey][key];
                if (contextKey.length === 0) {
                    values[key] = data.value;
                }
                else {
                    if (values[contextKey]) {
                        values[contextKey][key] = data.value;
                    }
                    else {
                        values[contextKey] = { [key]: data.value };
                    }
                }
            });
        });
        return JSON.stringify(values, null, this.indentation);
    }
    parse(contents) {
        const json = JSON.parse(utils_1.stripBOM(contents));
        const values = {};
        Object.keys(json).forEach(contextKey => {
            if (typeof json[contextKey] === 'object') {
                Object.keys(json[contextKey]).forEach(key => {
                    translation_collection_1.TranslationCollection.assign(values, key, { value: json[contextKey][key], context: contextKey });
                });
            }
            else {
                translation_collection_1.TranslationCollection.assign(values, contextKey, { value: json[contextKey], context: '' });
            }
        });
        return new translation_collection_1.TranslationCollection(values);
    }
}
exports.JsonCompiler = JsonCompiler;
//# sourceMappingURL=json.compiler.js.map