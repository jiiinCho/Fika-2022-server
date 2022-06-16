import bcrypt from "bcrypt";
import Post from "./database/models/Post.model.js";
import User from "./database/models/User.model.js";
import Location from "./database/models/Location.model.js";
import jwt from "jsonwebtoken";
import config from "./utils/config.js";

const hashSaltRounds = 10;

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
    searchLocation: async (_, args) => {
      const { business } = args;
      const found = await Location.find({
        business: { $regex: business, $options: "i" },
      });
      return found;
    },
    getAllUsers: async () => await User.find(),
    getUserById: async (_, args) => {
      const { id } = args.id;
      const found = await User.findById({ _id: id });
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
      const { id } = args;
      const post = await Post.findByIdAndUpdate(
        id,
        { $inc: { likes: 1 } },
        { new: true }
      );
      return post;
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
    createLocation: async (_, args) => {
      const location = new Location(args.location);
      await location.save();
      return location;
    },
  },
};

export default resolvers;
