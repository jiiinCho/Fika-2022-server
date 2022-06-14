import mongoose from "mongoose";
import { user } from "../modelNames.js";
import crypto from "crypto";

export const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex"),
  },
  avatar: {
    type: String,
    required: true,
  },
});

const User = mongoose.model(user, userSchema);

export default User;
