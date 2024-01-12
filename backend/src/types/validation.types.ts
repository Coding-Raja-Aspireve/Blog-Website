import { Types } from "mongoose";

export type DataProvided<T> = (
  data: (number | string | Date | undefined | string[] | Types.ObjectId)[]
) => T;

export type DataProvidedResult = {
  isNull: boolean;
  isNullValue: number[];
};
