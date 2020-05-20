import { CSVManager, Options, DataSet, DataModel, Value } from './CSVManager';

function sqFoots2sqMetres(sqrareFoot: Value): number {
  if (typeof sqrareFoot !== 'number') {
    sqrareFoot = parseFloat(sqrareFoot.replace('"', ''));
  }
  const squareMeters = sqrareFoot * 0.092903;
  return squareMeters;
}

const options: Options = {
  dataColumns: ['lat', 'long', 'sqft_living'],
  labelColumns: ['price'],
  converters: {
    sqft_living: (sqft_living: Value) => {
      return sqFoots2sqMetres(sqft_living);
    },
  },
  shuffle: false,
  splitTest: 0.1,
};

const csvManager = new CSVManager('example.csv', options);
const dataSet = csvManager.loadCSV();
console.log(dataSet.testLabels);
