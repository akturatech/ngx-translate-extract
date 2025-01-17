"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const translation_collection_1 = require("../../utils/translation.collection");
const colorette_1 = require("colorette");
const glob = require("glob");
const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
class ExtractTask {
    constructor(inputs, outputs, options) {
        this.inputs = inputs;
        this.outputs = outputs;
        this.options = {
            replace: false,
            patterns: []
        };
        this.parsers = [];
        this.postProcessors = [];
        this.inputs = inputs.map(input => path.resolve(input));
        this.outputs = outputs.map(output => path.resolve(output));
        this.options = Object.assign({}, this.options, options);
    }
    execute() {
        if (!this.compiler) {
            throw new Error('No compiler configured');
        }
        this.printEnabledParsers();
        this.printEnabledPostProcessors();
        this.printEnabledCompiler();
        this.out(colorette_1.bold('Extracting:'));
        const extracted = this.extract();
        this.out(colorette_1.green(`\nFound %d strings.\n`), extracted.count(''));
        this.out(colorette_1.bold('Saving:'));
        this.outputs.forEach(output => {
            let dir = output;
            let filename = `strings.${this.compiler.extension}`;
            if (!fs.existsSync(output) || !fs.statSync(output).isDirectory()) {
                dir = path.dirname(output);
                filename = path.basename(output);
            }
            const outputPath = path.join(dir, filename);
            let existing = new translation_collection_1.TranslationCollection();
            if (!this.options.replace && fs.existsSync(outputPath)) {
                existing = this.compiler.parse(fs.readFileSync(outputPath, 'utf-8'));
            }
            const draft = extracted.union(existing);
            if (existing.isEmpty('')) {
                this.out(colorette_1.dim(`- ${outputPath}`));
            }
            else {
                this.out(colorette_1.dim(`- ${outputPath} (merged)`));
            }
            const final = this.process(draft, extracted, existing);
            this.save(outputPath, final);
        });
        this.out(colorette_1.green('\nDone.\n'));
    }
    setParsers(parsers) {
        this.parsers = parsers;
        return this;
    }
    setPostProcessors(postProcessors) {
        this.postProcessors = postProcessors;
        return this;
    }
    setCompiler(compiler) {
        this.compiler = compiler;
        return this;
    }
    extract() {
        let extracted = new translation_collection_1.TranslationCollection();
        this.inputs.forEach(dir => {
            dir = dir.replace(/\\/g, '/');
            this.readDir(dir, this.options.patterns).forEach(path => {
                this.out(colorette_1.dim('- %s'), path);
                const contents = fs.readFileSync(path, 'utf-8');
                this.parsers.forEach(parser => {
                    extracted = extracted.union(parser.extract(contents, path, path.slice(path.indexOf(dir) + dir.length)));
                });
            });
        });
        return extracted;
    }
    process(draft, extracted, existing) {
        this.postProcessors.forEach(postProcessor => {
            draft = postProcessor.process(draft, extracted, existing);
        });
        return draft;
    }
    save(output, collection) {
        const dir = path.dirname(output);
        if (!fs.existsSync(dir)) {
            mkdirp.sync(dir);
        }
        fs.writeFileSync(output, this.compiler.compile(collection));
    }
    readDir(dir, patterns) {
        return patterns.reduce((results, pattern) => {
            return glob.sync(dir + pattern)
                .filter(path => fs.statSync(path).isFile())
                .concat(results);
        }, []);
    }
    out(...args) {
        console.log.apply(this, arguments);
    }
    printEnabledParsers() {
        this.out(colorette_1.cyan('Enabled parsers:'));
        if (this.parsers.length) {
            this.out(colorette_1.cyan(colorette_1.dim(this.parsers.map(parser => `- ${parser.constructor.name}`).join('\n'))));
        }
        else {
            this.out(colorette_1.cyan(colorette_1.dim('(none)')));
        }
        this.out();
    }
    printEnabledPostProcessors() {
        this.out(colorette_1.cyan('Enabled post processors:'));
        if (this.postProcessors.length) {
            this.out(colorette_1.cyan(colorette_1.dim(this.postProcessors.map(postProcessor => `- ${postProcessor.constructor.name}`).join('\n'))));
        }
        else {
            this.out(colorette_1.cyan(colorette_1.dim('(none)')));
        }
        this.out();
    }
    printEnabledCompiler() {
        this.out(colorette_1.cyan('Compiler:'));
        this.out(colorette_1.cyan(colorette_1.dim(`- ${this.compiler.constructor.name}`)));
        this.out();
    }
}
exports.ExtractTask = ExtractTask;
//# sourceMappingURL=extract.task.js.map