import mongoose from "mongoose";
import { user } from "../modelNames.js";

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
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  likedPosts: {
    type: [String],
  },
});

const User = mongoose.model(user, userSchema);

export default User;
