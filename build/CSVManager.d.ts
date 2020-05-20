export declare type Value = string | number;
declare type Callback = (value: Value) => Value;
declare type Converters = {
    [key: string]: Callback;
};
export declare type Options = {
    dataColumns: string[];
    labelColumns: string[];
    converters: Converters;
    shuffle: boolean;
    splitTest: 0.0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0;
};
export declare type DataModel = Value[][];
export declare type DataSet = {
    features: DataModel;
    labels: DataModel;
    testFeatures: DataModel;
    testLabels: DataModel;
};
export declare class CSVManager {
    filename: string;
    options: Options;
    constructor(filename: string, options: Options);
    loadCSV(): DataSet;
    private extractColumns;
}
export {};
