import { Logger } from "../types/console.types";

export const yellowLog = "\x1b[33m%s\x1b[0m";
export const greenLog = "\x1b[32m%s\x1b[0m";
export const redLog = "\x1b[31m%s\x1b[0m";

export const logger: Logger = (type, message): void => {
  console[type](message);
};
