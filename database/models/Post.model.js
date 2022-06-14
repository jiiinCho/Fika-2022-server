import mongoose from "mongoose";
import { locationSchema } from "./Location.model.js";
import { post } from "../modelNames.js";

const PostUserSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

const PostLocationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  business: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const PostSchema = new mongoose.Schema({
  user: PostUserSchema,
  location: PostLocationSchema,
  imgUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  review: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
});

const Post = mongoose.model(post, PostSchema);

export default Post;
