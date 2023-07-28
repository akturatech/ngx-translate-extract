"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepExtend = require("deep-extend");
class TranslationCollection {
    constructor(values = {}) {
        this.values = {};
        this.values = values;
    }
    static assign(values, key, data) {
        if (values[data.context]) {
            values[data.context][key] = data;
        }
        else {
            values[data.context] = { [key]: data };
        }
        return values;
    }
    add(key, data) {
        return new TranslationCollection(deepExtend(this.values, TranslationCollection.assign({}, key, data)));
    }
    addKeys(keys, data) {
        const values = keys.reduce((results, key, i) => {
            return TranslationCollection.assign(results, key, data[i]);
        }, {});
        return new TranslationCollection(deepExtend(this.values, values));
    }
    remove(key) {
        return this.filter(k => key !== k);
    }
    forEach(callback) {
        Object.keys(this.values).forEach(contextKey => {
            Object.keys(this.values[contextKey]).forEach(key => {
                callback.call(this, key, this.values[contextKey][key]);
            });
        });
        return this;
    }
    filter(callback) {
        let values = {};
        this.forEach((key, data) => {
            if (callback.call(this, key, data)) {
                TranslationCollection.assign(values, key, data);
            }
        });
        return new TranslationCollection(values);
    }
    map(callback) {
        const values = {};
        this.forEach((key, data) => {
            TranslationCollection.assign(values, key, callback.call(this, key, data));
        });
        return new TranslationCollection(values);
    }
    union(collection) {
        return new TranslationCollection(deepExtend(this.values, collection.values));
    }
    intersect(collection) {
        const values = {};
        this.filter((key, data) => collection.has(key, data.context))
            .forEach((key, data) => {
            TranslationCollection.assign(values, key, data);
        });
        return new TranslationCollection(values);
    }
    has(key, context = '') {
        return this.values[context] ? this.values[context].hasOwnProperty(key) : false;
    }
    get(key, context = '') {
        return this.values[context] ? this.values[context][key] : null;
    }
    keys(context) {
        return Object.keys(this.values[context]);
    }
    count(context) {
        return this.values[context] ? Object.keys(this.values[context]).length : 0;
    }
    isEmpty(context) {
        return this.values[context] ? Object.keys(this.values[context]).length === 0 : true;
    }
    sort(compareFn) {
        let values = {};
        Object.keys(this.values).forEach(contextKey => {
            this.keys(contextKey).sort(compareFn).forEach((key) => {
                TranslationCollection.assign(values, key, this.values[contextKey][key]);
            });
        });
        return new TranslationCollection(values);
    }
}
exports.TranslationCollection = TranslationCollection;
//# sourceMappingURL=translation.collection.js.map