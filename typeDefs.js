import { gql } from "apollo-server-express";

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  type User {
    id: ID
    username: String
    email: String
    password: String
    avatar: String
    accessToken: String
  }
  input LoginInput {
    username: String
    password: String
  }
  type AuthResponse {
    user: User
    message: String
  }
  input UserInput {
    username: String
    email: String
    password: String
    avatar: String
  }
  type Location {
    id: ID
    business: String
    street: String
    city: String
    country: String
  }
  input LocationInput {
    id: ID
    business: String!
    street: String!
    city: String!
    country: String!
  }
  type Post {
    id: ID
    user: PostUser
    location: Location
    imgUrl: String
    createdAt: String
    review: String
    likes: Int
    rating: Int
  }
  type PostUser {
    id: ID
    username: String
    avatar: String
  }
  input PostUserInput {
    id: ID!
    username: String!
    avatar: String!
  }
  input PostInput {
    user: PostUserInput!
    location: LocationInput!
    imgUrl: String!
    review: String!
    rating: Int
  }
  type Query {
    getAllPosts: [Post]
    getPostById(id: ID): Post
    getPostByLocation(locationId: ID): [Post]
    getAllLocation: [Location]
    getLocationById(id: ID): Location
    searchLocation(business: String): [Location]
    getAllUsers: [User]
    getUserById(id: ID): User
    login(user: LoginInput): AuthResponse
  }
  type Mutation {
    createPost(post: PostInput): Post
    deletePost(id: ID): String
    updatePost(id: ID, post: PostInput): Post
    updateLikes(id: ID): Post
    createUser(user: UserInput): AuthResponse
    updateUser(id: ID, user: UserInput): AuthResponse
    deleteUser(id: ID): AuthResponse
    createLocation(location: LocationInput): Location
  }
`;

export default typeDefs;
