import { BlogData, UserData } from "./schema.types";

export interface UserDataWithAccessToken extends UserData, BlogData {
  accessToken: string;
}
