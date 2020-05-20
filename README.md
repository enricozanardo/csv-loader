# CSV Loader

This package allow to manage the content of the csv files that are then used for machine learning purposes later on.

Example:

```ts
import { CSVManager, Options, DataSet, DataModel, Value } from './CSVManager';

// Converters
function sqFoots2sqMetres(sqrareFoot: Value): number {
  if (typeof sqrareFoot !== 'number') {
    sqrareFoot = parseFloat(sqrareFoot.replace('"', ''));
  }
  const squareMeters = sqrareFoot * 0.092903;
  return squareMeters;
}

// Options
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

// Data Management
const csvManager = new CSVManager('../csv/example.csv', options);
const dataSet = csvManager.loadCSV();
console.log(dataSet.testLabels);
```
