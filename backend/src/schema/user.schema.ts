import { Schema, Document, Types, model } from "mongoose";
import { UserDocument } from "../types/documents.types";

const UserSchema = new Schema<UserDocument>({
  authorId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
    required: true,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: true
  },
  dateOfBirth: {
    type: Schema.Types.Date,
    default: Date.now,
  },
  accountCreatedAt: {
    type: Schema.Types.Date,
    immutable: true,
    default: Date.now,
  },
  accountUpdatedAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },
  image: {
    type: String,
    default:
      "https://images.pexels.com/photos/18926843/pexels-photo-18926843/free-photo-of-rough-volcanic-rock-formation.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  role: {
    type: String,
    default: "User",
  },
  followers: {
    type: Number,
    default: 0,
  },
  socials: {
    type: [String],
    default: ["", "", "", ""],
  },
  verified: {
    type: Boolean,
    default: false
  }
});

UserSchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function (next) {
  this.set({ accountUpdatedAt: new Date() });
  next();
});

const User = model("user", UserSchema);

export default User;
