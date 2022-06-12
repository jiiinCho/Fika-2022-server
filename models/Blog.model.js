import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

const Blog = mongoose.model("blog", BlogSchema);
export default Blog;
