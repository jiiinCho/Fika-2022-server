import Post from "./models/Post.model.js";
import Blog from "./models/Blog.model.js";

const resolvers = {
  Query: {
    hello: () => "hello World",
    getAllPosts: async () => {
      const posts = await Post.find();
      return posts;
    },
    getPostById: async (_, args) => {
      const { id } = args;
      const found = await Post.findById({ _id: id });
      return found;
    },
    getAllBlogs: async () => {
      const blogs = await Blog.find();
      return blogs;
    },
  },
  Mutation: {
    createPost: async (parent, args, context, info) => {
      const { title, description } = args.post;
      const post = new Post({ title, description });
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
    addBlogPost: async (parent, args, content) => {
      const { text } = args.blog;
      const blog = new Blog({ text });
      await blog.save();
      return blog;
    },
    deleteBlogPost: async (parent, args) => {
      const { id } = args;
      const deleted = await Blog.deleteOne({ _id: id });
      return deleted;
    },
    updateBlogPost: async (parent, args) => {
      const { id } = args;
      const { text } = args.blog;
      const blog = await Blog.findByIdAndUpdate(id, { text }, { new: true });

      return blog;
    },
  },
};

export default resolvers;
