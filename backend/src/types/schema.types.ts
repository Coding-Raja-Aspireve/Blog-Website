import { Types } from "mongoose";

export interface UserData {
  authorId?: Types.ObjectId;
  username: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  password: string;
  accountCreatedAt?: Date;
  accountUpdatedAt?: Date;
  image: string;
  role?: "User" | "Admin";
  followers?: number;
  socials?: string[];
  verified: Boolean;
}

export interface AuthenticatorData {
  authorId?: Types.ObjectId;
  password: string;
}

export interface BlogData {
  blogId?: Types.ObjectId;
  title: string;
  summary: string;
  poster: string;
  passages: string[];
  types: string[];
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
  likes?: number;
  views?: number;
  reshares?: number;
  readTime: number;
  comment?: Comments[];
  username: string;
}


// export type UserDocument <T> = Document & T

// export interface AuthenticatorDocument extends Document {
//   authorId: Types.ObjectId;
//   password: string;
// }
export interface Reply {
  text: String,
  username: String,
  createdAt: Date,
  image: String,
}

export interface Comments {
  text: String,
  username: String,
  createdAt: Date,
  image: String,
  likes: Number,
  subcomments: Reply[]
}


export interface MapData {
  authorId?: Types.ObjectId;
  blogId?: Types.ObjectId;
}

export interface FollowerDocument extends Document {
  authorId: Types.ObjectId;
  followerId: Types.ObjectId;
}
