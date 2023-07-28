"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KeyAsDefaultValuePostProcessor {
    constructor() {
        this.name = 'KeyAsDefaultValue';
    }
    process(draft, extracted, existing) {
        return draft.map((key, data) => !data.value ? Object.assign({}, data, { value: key, context: data.context }) : data);
    }
}
exports.KeyAsDefaultValuePostProcessor = KeyAsDefaultValuePostProcessor;
//# sourceMappingURL=key-as-default-value.post-processor.js.map