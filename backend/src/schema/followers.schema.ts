import { Schema, model, Types } from "mongoose";
import { FollowerDocument } from "../types/schema.types";

const FollowerSchema = new Schema<FollowerDocument>({
  authorId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  followerId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const Follower = model("follower", FollowerSchema);

export default Follower;
