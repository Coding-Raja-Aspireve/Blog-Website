import { Schema, model, Types } from "mongoose";
import { AuthenticatorDocument } from "../types/documents.types";

const AuthenticatorSchema = new Schema<AuthenticatorDocument>({
  authorId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Authenticator = model("authenticator", AuthenticatorSchema);

export default Authenticator;
