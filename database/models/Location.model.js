import mongoose from "mongoose";
import { location } from "../modelNames.js";

export const locationSchema = new mongoose.Schema({
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

const Location = mongoose.model(location, locationSchema);

export default Location;
