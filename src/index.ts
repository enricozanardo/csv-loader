import { CSVManager, Options, DataSet, DataModel } from './CSVManager';

function sqFoots2sqMetres(sqrareFoot: string | number): number {
  return sqrareFoot * 0.092903;
}

const options: Options = {
  dataColumns: ['lat', 'long', 'sqft_living'],
  labelColumns: ['price'],
  converters: {
    sqft_living: (sqft_living: string | number) => {
      return sqFoots2sqMetres(sqft_living);
    },
  },
  shuffle: false,
  splitTest: 0.1,
};

const csvManager = new CSVManager('example.csv', options);
const dataSet = csvManager.loadCSV();
console.log(dataSet.testLabels);
