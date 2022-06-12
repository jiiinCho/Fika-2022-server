import { gql } from "apollo-server-express";

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  type Post {
    id: ID
    userId: String
    username: String
    locationId: ID
    address: String
    avatar: String
    imgUrl: String
    createdAt: String
    review: String
    likes: Int
  }
  input PostInput {
    userId: String
    username: String
    locationId: ID
    address: String
    avatar: String
    imgUrl: String
    review: String
  }
  type User {
    id: ID
    username: String
    email: String
    password: String
    avatar: String
  }
  input UserInput {
    username: String
    email: String
    password: String
    avatar: String
  }
  type Query {
    getAllPosts: [Post]
    getPostById(id: ID): Post
  }
  type Mutation {
    createPost(post: PostInput): Post
    deletePost(id: ID): String
    updatePost(id: ID, post: PostInput): Post
    createUser(user: UserInput): User
  }
`;

export default typeDefs;
