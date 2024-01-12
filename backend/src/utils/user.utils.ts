import { Types } from "mongoose";
import Follower from "../schema/followers.schema";
import { handleDuplicateKeyError } from "./auth.utils";
import {
  CheckPreviousFollow,
  SetFollow,
  UnsetFollow,
  UserUpdateFollowers,
} from "../types/controller.types";
import { FollowerDocument } from "../types/schema.types";
import User from "../schema/user.schema";

export const setFollow: SetFollow = async (authorId, followerId) => {
  const follow = new Follower({ authorId, followerId });
  return await follow.save().catch(handleDuplicateKeyError);
};

export const unsetFollow: UnsetFollow = async (authorId, followerId) => {
  const unfollow = await Follower.deleteOne({
    authorId,
    followerId,
  });
  return !unfollow.acknowledged;
};

export const checkPreviousFollow: CheckPreviousFollow = async (
  authorId,
  followerId
) => {
  const previousFollow = await Follower.findOne({
    authorId, followerId,
  });
  return previousFollow !== null;
};

export const userUpdateFollowers: UserUpdateFollowers = async (
  follower,
  increment
) => {
  const updateFollowerCount = await User.updateOne(
    { authorId: follower },
    { $inc: { followers: increment } }
  );
  if (!updateFollowerCount.acknowledged)
    throw Error("Follower Count not Updated");
  return;
};
