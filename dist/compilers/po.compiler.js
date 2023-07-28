"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const translation_collection_1 = require("../utils/translation.collection");
const gettext = require("gettext-parser");
class PoCompiler {
    constructor(options) {
        this.extension = 'po';
    }
    compile(collection) {
        const translations = {};
        Object.keys(collection.values).forEach(contextKey => {
            Object.keys(collection.values[contextKey]).forEach(key => {
                const data = collection.values[contextKey][key];
                const poData = {
                    msgid: key,
                    msgstr: data.value,
                    msgctxt: data.context ? data.context : undefined,
                    comments: {
                        extracted: data.comment ? data.comment : undefined,
                        reference: data.reference ? data.reference : undefined
                    }
                };
                if (translations[data.context]) {
                    translations[data.context][key] = poData;
                }
                else {
                    translations[data.context] = { [key]: poData };
                }
            });
        });
        const data = {
            charset: 'utf-8',
            headers: {
                'mime-version': '1.0',
                'content-type': 'text/plain; charset=utf-8',
                'content-transfer-encoding': '8bit'
            },
            translations
        };
        return gettext.po.compile(data);
    }
    parse(contents) {
        const collection = new translation_collection_1.TranslationCollection();
        const po = gettext.po.parse(contents, 'utf8');
        if (Object.keys(po.translations).length === 0) {
            return collection;
        }
        const values = {};
        Object.keys(po.translations).forEach(contextKey => {
            Object.keys(po.translations[contextKey]).forEach(key => {
                const poValue = po.translations[contextKey][key];
                const data = {
                    value: poValue.msgstr.pop(),
                    context: contextKey,
                    reference: poValue.comments ? poValue.comments.reference : undefined,
                    comment: poValue.comments ? poValue.comments.translator : undefined
                };
                translation_collection_1.TranslationCollection.assign(values, key, data);
            });
        });
        return new translation_collection_1.TranslationCollection(values);
    }
}
exports.PoCompiler = PoCompiler;
//# sourceMappingURL=po.compiler.js.map