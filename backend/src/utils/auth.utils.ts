import { compare, hash } from "bcrypt";
import { Types } from "mongoose";
import User from "../schema/user.schema";
import Auth from "../schema/auth.schema";
import { CreateObject, CreateNewObject } from "../types/documents.types";
import { UserData } from "../types/schema.types";
import { UserDocument } from "../types/documents.types";
import { AuthenticatorDocument } from "../types/documents.types";
import { CheckUsernameByUsername, UpdateUser, UpdateUserPassword, ValidateUserPassword } from "../types/controller.types";
import Authenticator from "../schema/auth.schema";

export const createUserObject: CreateObject<UserData, UserDocument> = async (
  userData
) => {
  const user = new User({ ...userData, authorId: new Types.ObjectId() });
  return await user.save().catch(handleDuplicateKeyError);
};

export const createAuthObject: CreateNewObject<
  UserData,
  string,
  AuthenticatorDocument
> = async (user, password) => {
  if (user.authorId === undefined) throw Error("Author is not Defined");
  const credential = new Auth({
    authorId: user.authorId,
    password: await hash(password, 10),
  });
  return await credential.save().catch(handleDuplicateKeyError);
};

export const handleDuplicateKeyError = (error: any) => {
  if (error.keyPattern) {
    throw new Error(
      `Your ${Object.keys(error.keyPattern)[0]} is already in use`
    );
  }
  throw error;
};

export const checkUserByUsername: CheckUsernameByUsername = async (
  username
) => {
  const user = await User.find({ $or: [{ username }, { email: username }] });
  if (user.length < 1) throw Error("Incorrect Email or Username");
  if (user.length > 1) throw Error("Storage Error, Contact Admin Immediately");
  return user[0];
};


export const validateUsersPassword: ValidateUserPassword = async (userData, password) => {
  const getPassword = await Authenticator.find({authorId: userData.authorId})
  if (getPassword.length < 1) throw Error("Incorrect Email or Username");
  if(getPassword.length > 1) throw Error("Storage Error, Contact Admin Immediately")
  if(!await compare(password, getPassword[0].password) ) throw Error("Incorrect Password")
  return 
}

export const updateExistingUser: UpdateUser = async (user) => {
  const isUpdated = await User.updateOne(
    { authorId: user.authorId },
    { ...user }
  );
  if (!isUpdated.acknowledged) throw Error("User Data not Updated");
  const updatedUser = await User.find({ authorId: user.authorId });
  return updatedUser[0];
};

export const updateExistingUserPassword: UpdateUserPassword = async (authData) => {
  const isUpdated = await Authenticator.updateOne(
    { authorId: authData.authorId },
    { password: await hash(authData.password, 10) }
  );
  if (!isUpdated.acknowledged) throw Error("User Data not Updated");
  const updatedUser = await User.find({ authorId: authData.authorId });
  return updatedUser[0];
};
