import { Document } from "mongoose";
import { AuthenticatorData, BlogData, MapData, UserData } from "./schema.types";

export type UserDocument = UserData & Document;
export type AuthenticatorDocument = AuthenticatorData & Document;
export type BlogDocument = BlogData & Document;
export type MapDocument = MapData & Document;

export type CreateObject<T, U> = (arg0: T) => Promise<U>;
export type CreateNewObject<T, U, V> = (arg0: T, arg1: U) => Promise<V>;
