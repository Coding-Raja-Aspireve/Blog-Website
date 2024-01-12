import { Request, Response } from "express";

export interface serverHealth {
  message: string;
}
export interface RequestBody<T> extends Request {
  body: T;
}
export type ResponseBody<T> = ErrorResponse<T> | MessageResponse<T>;

interface ErrorResponse<T> extends Response {
  error?: T;
}
interface MessageResponse<T> extends Response {
  message?: T;
}
