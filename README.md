# CSV Loader in Typescript

This package allow to manage the content of the .csv files that are then used for machine learning purposes later on.

## How to use it

Imagine having a .csv file called cars.csv for which further analysis must be performed on a machine learning application. 👨‍💻

### Sample file [cars.csv]

```csv
passedemissions,mpg,cylinders,displacement,horsepower,weight,acceleration,modelyear,carname
FALSE,18,8,307,130,1.752,12,70,chevrolet chevelle malibu
FALSE,15,8,350,165,1.8465,11.5,70,buick skylark 320
FALSE,18,8,318,150,1.718,11,70,plymouth satellite
FALSE,16,8,304,150,1.7165,12,70,amc rebel sst
FALSE,17,8,302,140,1.7245,10.5,70,ford torino
FALSE,15,8,429,198,2.1705,10,70,ford galaxie 500
FALSE,14,8,454,220,2.177,9,70,chevrolet impala
FALSE,14,8,440,215,2.156,8.5,70,plymouth fury iii
FALSE,14,8,455,225,2.2125,10,70,pontiac catalina
FALSE,15,8,390,190,1.925,8.5,70,amc ambassador dpl
...
...
...
```

### Options ⚙️

Before to load the file it is important to decide which actions are needed to the data source before to be able to use it for further analysis.

```
const options: Options = {
  dataColumns: ['mpg'],
  labelColumns: ['horsepower'],
  converters: {},
  shuffle: false,
  splitTest: 0.1,
};
```

Let's talk about the meaning of each option:

- **dataColumns**: This is an array that contains the list of the columns that are taken into account for further analysis (like features columns);
- **labelColumns**: This is an array that contains the list of the  columns that are taken into account as the target columns for further analysis;
- **converters**: This is a dictionary of values pairs where the key is a column name and the value is a function that will be activated for each value in the column represented by the key. More detail in the next paragraph.
- **shuffle**: is a boolean. If true the data inside the dataset will be shuffled;
- **splitTest**: Represent, in percentage, the subset of the dataset that will be used as test data. The possible values are in the range 0.0 (no test data) to 1.0 (all dataset is used as test data) with intervals of 0.1. For example 0.1, 0.2 .. and so on. The meaning of the values are the percentage that will be taken for example 0.1 = 10%.

### Converters 🔬

Converters is a dictionary that could be used to provide some dedicated actions to the specific column data based on the name of the column that will be used as a key. 

Example:

```
...
  converters: {
    mpg: (mpg: Value) => {
      return mpg2kml(mpg);
    },
  },
...

```

This specific converter, for example, is converting from Miles Per Gallon (mpg) to Kilometres Per Litre. 

This is the function used from this converter when the data of the column **mpg** is parsed from the csv-loader

```ts
function mpg2kml(mpg: Value): number {
  if (typeof mpg !== 'number') {
    mpg = parseFloat(mpg.replace('"', ''));
  }
  const kml = mpg * 0.425144;
  return kml;
}
``` 


### Full Example

Here is reported the full example written in the index.ts file that show a possible use of this library. 🚀

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
console.log(dataSet.testFeatures);
console.log(dataSet.features);
console.log(dataSet.labels);
```

The cars.csv file is stored into a folder called /csv/. Once that the CSVManager is created and the path of the csv file is defined as well as its options, the result is stored into the dataSet constant.

The dataSet has four elements representing the test labels, the test features, the labels and the features of the initially given cars.csv file.

Now this elements can be used for further machine learning analysis. 🎉 

Happy hacking 🙌