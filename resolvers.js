import bcrypt from "bcrypt";
import Post from "./database/models/Post.model.js";
import User from "./database/models/User.model.js";
import Location from "./database/models/Location.model.js";

const hashSaltRounds = 10;

const resolvers = {
  Query: {
    getAllPosts: async () => {
      console.log("getAll");
      const posts = await Post.find();
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
    getAllUsers: async () => await User.find(),
    getUserById: async (_, args) => {
      const { id } = args;
      const found = await User.findById({ _id: id });
      return found;
    },
  },
  Mutation: {
    createPost: async (_, args) => {
      const { user, location, imgUrl, review } = args.post;
      let locationVar = location;
      if (!location.id) {
        locationVar = await Location(location);
        await locationVar.save();
      }
      const post = new Post({
        user,
        location: locationVar,
        imgUrl,
        review,
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
    createUser: async (_, args) => {
      const { username, email, password, avatar } = args.user;
      const hashed = bcrypt.hashSync(password, hashSaltRounds);
      const user = new User({ username, email, password: hashed, avatar });
      await user.save();
      return user;
    },
    createLocation: async (_, args) => {
      const location = new Location(args.location);
      await location.save();
      return location;
    },
  },
};

export default resolvers;
