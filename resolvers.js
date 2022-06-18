import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Post from "./database/models/Post.model.js";
import User from "./database/models/User.model.js";
import Location from "./database/models/Location.model.js";
import jwt from "jsonwebtoken";
import config from "./utils/config.js";

const hashSaltRounds = 10;

const authFailResponse = {
  user: null,
  message: "Authorization failed, fail to delete user",
};

const resolvers = {
  Query: {
    getAllPosts: async () => {
      const posts = await Post.find();
      return posts;
    },
    getPostByLocation: async (_, args) => {
      const { locationId } = args;
      const posts = await Post.find({ "location.id": locationId });
      return posts;
    },
    getPostById: async (_, args) => {
      const { id } = args;
      const found = await Post.findById({ _id: id });
      return found;
    },
    getAllLocation: async () => await Location.find(),
    getLocationById: async (_, args) => {
      const { id } = args;
      const found = await Location.findById({ _id: id });
      return found;
    },
    getLocationByName: async (_, args) => {
      const { business } = args;
      const found = await Location.find({
        business: { $regex: business, $options: "i" },
      });
      return found;
    },
    getLocationByCity: async (_, args) => {
      const { city } = args;
      const found = await Location.find({
        city: { $regex: city, $options: "i" },
      });
      return found;
    },
    getAllUsers: async () => await User.find(),
    getUserById: async (_, args) => {
      const found = await User.findById({ _id: args.id });
      return found;
    },
    login: async (_, args) => {
      const { username, password } = args.user;
      const found = await User.findOne({ username });
      if (!found) {
        return { user: null, message: "Incorrect username or password" };
      }
      const isMatch = await bcrypt.compare(password, found.password);
      if (!isMatch) {
        return { user: null, message: "Incorrect username or password" };
      }
      return { user: found, message: "Success" };
    },
  },
  Mutation: {
    createPost: async (_, args, context) => {
      const { user, location, imgUrl, review, rating } = args.post;
      let locationVar = location;
      if (location.id === "0") {
        const newLocation = await Location(location);
        await newLocation.save();
        locationVar["id"] = newLocation._id.toString();
      }
      const post = new Post({
        user,
        location: locationVar,
        imgUrl,
        review,
        rating,
      });
      await post.save();
      return post;
    },
    deletePost: async (parent, args) => {
      const { id } = args;
      await Post.deleteOne({ _id: id });
      return "deleted";
    },
    updatePost: async (parent, args) => {
      const { id } = args;
      const { title, description } = args.post;
      const post = await Post.findByIdAndUpdate(
        id,
        { title, description },
        { new: true }
      );

      return post;
    },
    updateLikes: async (parent, args) => {
      const { id, userId } = args;
      const found = await User.findById({ _id: userId });
      const isExist = found.likedPosts.filter((postId) => postId === id);

      if (!isExist.length) {
        const post = await Post.findByIdAndUpdate(
          id,
          { $inc: { likes: 1 } },
          { new: true }
        );
        await User.updateOne(
          { _id: userId },
          { $push: { likedPosts: id } },
          { new: true }
        );
        return { post, liked: true };
      } else {
        const post = await Post.findByIdAndUpdate(
          id,
          { $inc: { likes: -1 } },
          { new: true }
        );
        await User.updateOne(
          { _id: userId },
          { $pull: { likedPosts: id } },
          { new: true }
        );
        return { post, liked: false };
      }
    },
    createUser: async (_, args) => {
      const { username, email, password, avatar } = args.user;
      const found = await User.findOne({ username });
      if (found) {
        return { user: null, message: "Username already exists" };
      }
      const hashed = bcrypt.hashSync(password, hashSaltRounds);
      const accessToken = jwt.sign({ username, avatar }, config.jwt.secret);
      const user = new User({
        username,
        email,
        password: hashed,
        avatar,
        accessToken,
      });

      await user.save();
      return { user, message: "Success" };
    },
    deleteUser: async (parent, args, context) => {
      if (!context.user) {
        return authFailResponse;
      }
      const { id } = args;
      await User.deleteOne({ _id: id });
      return { user: null, message: "User deleted" };
    },
    updateUser: async (parent, args, context) => {
      if (!context.user) {
        return authFailResponse;
      }
      const { id } = args;
      const { username, password: reqPassword, email, avatar } = args.user;
      if (context.user.username !== username) {
        return {
          user: null,
          message: "Authorization failed, fail to update user info",
        };
      }

      const found = await User.findById({ _id: id });
      const password = reqPassword
        ? bcrypt.hashSync(reqPassword, hashSaltRounds)
        : found.password;
      const updated = await User.findByIdAndUpdate(
        id,
        { password, email, avatar },
        { new: true }
      );
      return { user: updated, message: "User info updated" };
    },
    createLocation: async (_, args) => {
      const location = new Location(args.location);
      await location.save();
      return location;
    },
  },
};

export default resolvers;
