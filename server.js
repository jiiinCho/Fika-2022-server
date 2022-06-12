import express from "express";
import { ApolloServer } from "apollo-server-express";
import http from "http";
import mongoose from "mongoose";

import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers.js";

import startDB from "./database/database.js";

const PORT = process.env.PORT || 8080;

// async function startServer() {
//   const app = express();
//   const httpServer = http.createServer(app);
//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     csrfPrevention: true,
//   });
//   console.log("server", server);
//   console.log("port", port);
//   startDB().then(async () => {
//     await new Promise((resolve) => httpServer.listen({ port }, resolve));
//     console.log(
//       `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
//     );
//   });
//   // await startDB();
//   // await new Promise((resolve) => httpServer.listen({ port }, resolve));
// }

// startServer();

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
  });

  await server.start(); // schema loaded before listening the server
  server.applyMiddleware({ app, path: "/" });

  startDB().then(async () => {
    // Modified server startup
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

startServer();
