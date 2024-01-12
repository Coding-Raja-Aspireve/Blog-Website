import { Request, Response, NextFunction } from "express";
import { RequestBody, ResponseBody } from "./routes.types";
import {
  AuthenticatorDocument,
  BlogDocument,
  UserDocument,
} from "./documents.types";
import {
  AuthenticatorData,
  FollowerDocument,
  MapData,
  UserData,
} from "./schema.types";
import { Types } from "mongoose";
import { BlogData } from "./schema.types";

export type ControllerWithNext<T, U> = (
  req: RequestBody<T>,
  res: ResponseBody<U>,
  next: NextFunction
) => Promise<void | ResponseBody<U>>;

export type ControllerWithoutNext<T, U> = (
  req: RequestBody<T>,
  res: ResponseBody<U>
) => Promise<ResponseBody<U>>;

export type CheckUsernameByUsername = (
  username: string
) => Promise<UserDocument>;

export type ValidateUserPassword = (
  userData: UserDocument,
  password: string
) => Promise<void>;

export type UpdateUser = (user: UserData) => Promise<UserDocument>;

export type UpdateUserPassword = (
  authData: AuthenticatorData
) => Promise<UserDocument>;

export interface Follow extends UserData, Request {
  followee?: Types.ObjectId;
  follower?: Types.ObjectId;
}

export type SetFollow = (
  authorId: Types.ObjectId,
  followerId: Types.ObjectId
) => Promise<FollowerDocument>;

export type UnsetFollow = (
  authorId: Types.ObjectId,
  followerId: Types.ObjectId
) => Promise<Boolean>;

export type UserUpdateFollowers = (
  follower: Types.ObjectId,
  increment: Number
) => Promise<void>;

export type CheckPreviousFollow = (
  authorId: Types.ObjectId,
  followerId: Types.ObjectId
) => Promise<Boolean>;

export type FetchMultipleBlogs = (
  idArray?: (string | Types.ObjectId)[]
) => Promise<BlogDocument[]>;

export type UpdateBlogData = (BlogData: BlogData) => Promise<Boolean>;

export type CheckIfMapPresent = (
  authorId: Types.ObjectId,
  blogId: Types.ObjectId
) => Promise<Boolean>;
export type CreateNewBlog = (Blog: BlogData) => Promise<BlogData>;

export type MapAuthorBlog = (
  authorId: Types.ObjectId,
  blogId: Types.ObjectId
) => Promise<MapData>;

export type DeleteBlog = (blogs: Types.ObjectId[]) => Promise<void>;

export type DeleteMap = (blogs: Types.ObjectId[]) => Promise<void>;
