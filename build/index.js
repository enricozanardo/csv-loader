"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CSVManager_1 = require("./CSVManager");
// Converters
function sqFoots2sqMetres(sqrareFoot) {
    if (typeof sqrareFoot !== 'number') {
        sqrareFoot = parseFloat(sqrareFoot.replace('"', ''));
    }
    const squareMeters = sqrareFoot * 0.092903;
    return squareMeters;
}
// Options
const options = {
    dataColumns: ['lat', 'long', 'sqft_living'],
    labelColumns: ['price'],
    converters: {
        sqft_living: (sqft_living) => {
            return sqFoots2sqMetres(sqft_living);
        },
    },
    shuffle: false,
    splitTest: 0.1,
};
// Data Management
const csvManager = new CSVManager_1.CSVManager('../csv/example.csv', options);
const dataSet = csvManager.loadCSV();
// console.log(dataSet.testLabels);
