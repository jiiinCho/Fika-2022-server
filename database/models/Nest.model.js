import mongoose from "mongoose";
import { nest } from "../modelNames.js";
import { userSchema } from "./User.model.js";
import { locationSchema } from "./Location.model.js";

const NestSchema = new mongoose.Schema({
  user: userSchema,
  location: locationSchema,
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
});

const Nest = mongoose.model(nest, NestSchema);

export default Nest;
