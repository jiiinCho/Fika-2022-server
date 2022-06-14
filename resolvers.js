import bcrypt from "bcrypt";
import Post from "./database/models/Post.model.js";
import User from "./database/models/User.model.js";
import Nest from "./database/models/Nest.model.js";

const hashSaltRounds = 10;

const resolvers = {
  Query: {
    getAllPosts: async () => {
      const posts = await Post.find();
      return posts;
    },
    getPostById: async (_, args) => {
      const { id } = args;
      const found = await Post.findById({ _id: id });
      return found;
    },
    getAllTemp: async () => {
      const nests = await Nest.find();
      return nests;
    },
  },
  Mutation: {
    createPost: async (_, args) => {
      const { userId, username, locationId, address, avatar, imgUrl, review } =
        args.post;
      const post = new Post({
        userId,
        username,
        locationId,
        address,
        avatar,
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
    createTemp: async (_, args) => {
      const { user, location, imgUrl, review } = args.nest;
      const nest = new Nest({
        user,
        location,
        imgUrl,
        review,
      });
      await nest.save();
      return nest;
    },
  },
};

export default resolvers;
