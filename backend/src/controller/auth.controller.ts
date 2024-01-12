import { sign, verify } from "jsonwebtoken";
import { dataProvidedIsNull } from "../utils/validation.utils";
import {
  createUserObject,
  createAuthObject,
  checkUserByUsername,
  validateUsersPassword,
  updateExistingUser,
  updateExistingUserPassword,
} from "../utils/auth.utils";
import { UserDataWithAccessToken } from "../types/modified.types";
import { errormessages } from "../types/static.types";
import {
  ControllerWithNext,
  ControllerWithoutNext,
} from "../types/controller.types";
import { AuthenticatorData, UserData } from "../types/schema.types";

export const register: ControllerWithNext<UserData, string> = async (
  req,
  res,
  next
) => {
  try {
    const UserData = req.body;
    const data = dataProvidedIsNull([
      UserData.username,
      UserData.email,
      UserData.password,
      UserData.dateOfBirth,
      UserData.phoneNumber,
    ]);
    if (data.isNull) throw Error("Complete Data Not Provided");
    const createUser = await createUserObject(UserData);
    await createAuthObject(createUser, UserData.password);
    req.body.image = createUser.image;
    return next();
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login: ControllerWithNext<UserData, string> = async (
  req,
  res,
  next
) => {
  try {
    const UserData = req.body;
    const data = dataProvidedIsNull([UserData.username, UserData.password]);
    if (data.isNull) throw Error("Complete Data Not Provided");
    const findUser = await checkUserByUsername(UserData.username);
    await validateUsersPassword(findUser, UserData.password);
    req.body = findUser;
    return next();
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const fetchUser: ControllerWithNext<
  UserDataWithAccessToken,
  string
> = async (req, res, next) => {
  try {
    const UserData = req.body;
    const data = dataProvidedIsNull([UserData.accessToken]);
    if (data.isNull) throw Error(errormessages.notSignedIn);
    const accessToken = verify(UserData.accessToken, "secret");
    if (typeof accessToken === "string")
      throw Error("User Session Expired, Sign in Again");
    const findUser = await checkUserByUsername(accessToken.username);
    req.body = { ...UserData, authorId: findUser.authorId, username: findUser.username, image: findUser.image };
    return next();
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const returnUser: ControllerWithNext<
  UserDataWithAccessToken,
  string
> = async (req, res, next) => {
  try {
    const UserData = req.body
    return res.status(200).json({message: "User Signedin Successfully", UserData})
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export const updateUser: ControllerWithNext<UserData, string> = async (
  req,
  res,
  next
) => {
  try {
    const UserData = req.body;
    const update = await updateExistingUser(UserData);
    req.body = update;
    return next();
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUserPassword: ControllerWithNext<
  AuthenticatorData,
  string
> = async (req, res, next) => {
  try {
    const AuthData = req.body;
    const update = await updateExistingUserPassword(AuthData);
    req.body = update;
    next();
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendTokensToUser: ControllerWithoutNext<UserData, string> = async (
  req,
  res
) => {
  try {
    const token = { email: req.body.email, username: req.body.username };
    const userData = { username: req.body.username, image: req.body.image };
    const accessToken = sign(token, "secret", {
      expiresIn: "24h",
    });
    return res.status(200).json({
      message: "User Created Successfully",
      accessToken,
      userData,
    });
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
