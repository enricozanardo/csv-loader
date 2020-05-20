"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSVManager = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const lodash_1 = __importDefault(require("lodash"));
const shuffle_seed_1 = __importDefault(require("shuffle-seed"));
class CSVManager {
    constructor(filename, options) {
        this.filename = filename;
        this.options = options;
    }
    loadCSV() {
        const LIBRARY_PATH = `${__dirname}`;
        const HOME_PATH = path_1.default.join(`${LIBRARY_PATH}`, '../../..');
        let loadedData = fs_1.default.readFileSync(`${HOME_PATH}/${this.filename}`, {
            encoding: 'utf-8',
        });
        let rawData = lodash_1.default.map(loadedData.split('\n'), (d) => d.split(','));
        rawData = lodash_1.default.dropRightWhile(rawData, (val) => lodash_1.default.isEqual(val, ['']));
        const headers = lodash_1.default.first(rawData) || [];
        const new_data = lodash_1.default.map(rawData, (row, index) => {
            if (index == 0) {
                return row;
            }
            return lodash_1.default.map(row, (element, index) => {
                // Based on the column name, activate the converter function
                // that will update the value in that column name, in the given row.
                if (this.options.converters[headers[index]]) {
                    const converted = this.options.converters[headers[index]](element);
                    // console.log(converted);
                }
                if (typeof element !== 'number') {
                    element = parseFloat(element.replace('"', ''));
                }
                return element;
            });
        });
        let labels = this.extractColumns(new_data, this.options.labelColumns);
        let extractedData = this.extractColumns(new_data, this.options.dataColumns);
        extractedData.shift();
        labels.shift();
        if (this.options.shuffle) {
            extractedData = shuffle_seed_1.default.shuffle(extractedData, 'enrynewton');
            labels = shuffle_seed_1.default.shuffle(labels, 'enrynewton');
        }
        const trainSize = Math.floor(extractedData.length * this.options.splitTest);
        const dataSet = {
            features: extractedData.slice(trainSize),
            labels: labels.slice(trainSize),
            testFeatures: extractedData.slice(0, trainSize),
            testLabels: labels.slice(0, trainSize),
        };
        return dataSet;
    }
    extractColumns(data, columnNames) {
        const headers = lodash_1.default.first(data);
        let extracted = [];
        if (headers) {
            const indexes = lodash_1.default.map(columnNames, (column) => headers.indexOf(column));
            extracted = lodash_1.default.map(data, (row) => lodash_1.default.pullAt(row, indexes));
        }
        return extracted;
    }
}
exports.CSVManager = CSVManager;
