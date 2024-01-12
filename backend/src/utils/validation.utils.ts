import { DataProvided, DataProvidedResult } from "../types/validation.types";

export const dataProvidedIsNull: DataProvided<DataProvidedResult> = (data) => {
  const result: DataProvidedResult = data.reduce(
    (accumulator, value, index) => {
      if (value === undefined || value === null) {
        accumulator.isNull = true;
        accumulator.isNullValue.push(index);
      }
      return accumulator;
    },
    { isNull: false, isNullValue: [] } as DataProvidedResult
  );
  return result;
};


