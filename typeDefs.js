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
  type Location {
    id: ID
    business: String
    street: String
    city: String
    country: String
  }
  input LocationInput {
    business: String
    street: String
    city: String
    country: String
  }
  type Temp {
    id: ID
    user: User
    location: Location
    imgUrl: String
    createdAt: String
    review: String
    likes: Int
  }
  input TempInput {
    user: UserInput
    location: LocationInput
    imgUrl: String
    review: String
  }
  type Query {
    getAllPosts: [Post]
    getPostById(id: ID): Post
    getAllTemp: [Temp]
  }
  type Mutation {
    createPost(post: PostInput): Post
    deletePost(id: ID): String
    updatePost(id: ID, post: PostInput): Post
    createUser(user: UserInput): User
    createTemp(nest: TempInput): Temp
  }
`;

export default typeDefs;
