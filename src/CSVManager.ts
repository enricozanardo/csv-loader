import fs from 'fs';
import _ from 'lodash';
import shuffleSeed from 'shuffle-seed';

export type Value = string | number;
type Callback = (value: Value) => Value;
type Converters = { [key: string]: Callback };

export type Options = {
  dataColumns: string[];
  labelColumns: string[];
  converters: Converters;
  shuffle: boolean;
  splitTest: 0.0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0;
};

export type DataModel = Value[][];
type Headers = string[number];

export type DataSet = {
  features: DataModel;
  labels: DataModel;
  testFeatures: DataModel;
  testLabels: DataModel;
};

export class CSVManager {
  constructor(public filename: string, public options: Options) {}

  public loadCSV() {
    const PATH_CSV = `${__dirname}`;

    let loadedData = fs.readFileSync(`${PATH_CSV}/${this.filename}`, {
      encoding: 'utf-8',
    });
    let rawData = _.map(loadedData.split('\n'), (d) => d.split(','));
    rawData = _.dropRightWhile(rawData, (val) => _.isEqual(val, ['']));

    const headers = _.first(rawData) || [];

    const new_data = _.map(rawData, (row: Value[], index: number) => {
      if (index == 0) {
        return row;
      }

      return _.map(row, (element: Value, index: number) => {
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

    let labels: DataModel = this.extractColumns(
      new_data,
      this.options.labelColumns
    );
    let extractedData: DataModel = this.extractColumns(
      new_data,
      this.options.dataColumns
    );

    extractedData.shift();
    labels.shift();

    if (this.options.shuffle) {
      extractedData = shuffleSeed.shuffle(extractedData, 'enrynewton');
      labels = shuffleSeed.shuffle(labels, 'enrynewton');
    }

    const trainSize = Math.floor(extractedData.length * this.options.splitTest);

    const dataSet: DataSet = {
      features: extractedData.slice(trainSize),
      labels: labels.slice(trainSize),
      testFeatures: extractedData.slice(0, trainSize),
      testLabels: labels.slice(0, trainSize),
    };

    return dataSet;
  }

  private extractColumns(data: Value[][], columnNames: string[]) {
    const headers = _.first(data);

    let extracted: Value[][] = [];

    if (headers) {
      const indexes = _.map(columnNames, (column) => headers.indexOf(column));
      extracted = _.map(data, (row) => _.pullAt(row, indexes));
    }

    return extracted;
  }
}
