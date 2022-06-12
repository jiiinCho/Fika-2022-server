import { gql } from "apollo-server-express";

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  type Post {
    id: ID
    title: String
    description: String
  }
  type Blog {
    id: ID
    text: String
  }
  input PostInput {
    title: String!
    description: String!
  }
  input BlogInput {
    text: String!
  }
  type Query {
    hello: String
    getAllPosts: [Post]
    getPostById(id: ID): Post
    getAllBlogs: [Blog]
  }

  type Mutation {
    createPost(post: PostInput): Post
    deletePost(id: ID): String
    updatePost(id: ID, post: PostInput): Post
    addBlogPost(blog: BlogInput): Blog
    deleteBlogPost(id: ID): Blog
    updateBlogPost(id: ID, blog: BlogInput): Blog
  }
`;

export default typeDefs;
