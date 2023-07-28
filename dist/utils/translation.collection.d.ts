export interface TranslationData {
    value: string;
    context: string;
    reference?: string;
    comment?: string;
}
export interface TranslationType {
    [key: string]: {
        [key: string]: TranslationData;
    };
}
export declare class TranslationCollection {
    static assign(values: TranslationType, key: string, data: TranslationData): TranslationType;
    values: TranslationType;
    constructor(values?: TranslationType);
    add(key: string, data: TranslationData): TranslationCollection;
    addKeys(keys: string[], data: TranslationData[]): TranslationCollection;
    remove(key: string): TranslationCollection;
    forEach(callback: (key?: string, data?: TranslationData) => void): TranslationCollection;
    filter(callback: (key?: string, data?: TranslationData) => boolean): TranslationCollection;
    map(callback: (key?: string, data?: TranslationData) => TranslationData): TranslationCollection;
    union(collection: TranslationCollection): TranslationCollection;
    intersect(collection: TranslationCollection): TranslationCollection;
    has(key: string, context?: string): boolean;
    get(key: string, context?: string): TranslationData;
    keys(context: string): string[];
    count(context: string): number;
    isEmpty(context: string): boolean;
    sort(compareFn?: (a: string, b: string) => number): TranslationCollection;
}
