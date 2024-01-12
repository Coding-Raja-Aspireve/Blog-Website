import { checkUserByUsername } from "../utils/auth.utils";
import {
  ControllerWithNext,
  ControllerWithoutNext,
  Follow,
} from "../types/controller.types";
import { UserDocument } from "../types/documents.types";
import {
  checkPreviousFollow,
  setFollow,
  unsetFollow,
  userUpdateFollowers,
} from "../utils/user.utils";
import { UserDataWithAccessToken } from "../types/modified.types";

export const fetchUserUsingUsername: ControllerWithoutNext<
  string,
  UserDocument
> = async (req, res) => {
  try {
    const username = req.params.username;
    const userData = await checkUserByUsername(username);
    return res.status(200).json({ message: "User Found", userData });
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const fetchUsername: ControllerWithNext<Follow, void> = async (
  req,
  res,
  next
) => {
  try {
    const username = req.params.username;
    const userData = await checkUserByUsername(username);
    req.body.followee = userData.authorId!;
    next();
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const checkFollowConditions: ControllerWithNext<Follow, void> = async (
  req,
  res,
  next
) => {
  try {
    const UserWantingToFollow = req.body.authorId!;
    const UserToFollow = req.body.followee!;
    if (UserToFollow.equals(UserWantingToFollow))
      throw Error("User Cannot Follow Himself");
    if (await checkPreviousFollow(UserToFollow, UserWantingToFollow))
      throw Error("User Already Followed");
    next();
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const checkUnfollowConditions: ControllerWithNext<Follow, void> = async (
  req,
  res,
  next
) => {
  try {
    const UserWantingToFollow = req.body.authorId!;
    const UserToFollow = req.body.followee!;
    if (UserToFollow.equals(UserWantingToFollow))
      throw Error("User Cannot Follow Himself");
    if (!(await checkPreviousFollow(UserToFollow, UserWantingToFollow)))
      throw Error("User Does Not Follow");
    return next();
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const setFollwersSchema: ControllerWithNext<
  UserDataWithAccessToken & Follow,
  void
> = async (req, res, next) => {
  try {
    const UserWantingToFollow = req.body.authorId!;
    const UserToFollow = req.body.followee!;
    await setFollow(UserToFollow, UserWantingToFollow);
    return next();
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const unsetFollwersSchema: ControllerWithNext<
  UserDataWithAccessToken & Follow,
  void
> = async (req, res, next) => {
  try {
    const UserWantingToFollow = req.body.authorId!;
    const UserToFollow = req.body.followee!;
    if (await unsetFollow(UserToFollow, UserWantingToFollow))
      throw Error("User cannot be Unfollowed");
    return next();
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const setUserSchemaFollower: ControllerWithoutNext<
  Follow,
  void
> = async (req, res) => {
  try {
    const UserToFollow = req.body.followee!;
    await userUpdateFollowers(UserToFollow, 1);
    return res.status(200).json({ message: "User Followed" });
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const unsetUserSchemaFollower: ControllerWithoutNext<
  Follow,
  void
> = async (req, res) => {
  try {
    const UserToFollow = req.body.followee!;
    await userUpdateFollowers(UserToFollow, -1);
    return res.status(200).json({ message: "User Unofollowed" });
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
