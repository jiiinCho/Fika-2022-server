import express from "express";
import { ApolloServer } from "apollo-server-express";
import http from "http";
import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers.js";
import startDB from "./database/database.js";
import config from "./utils/config.js";
import { tokenValidator } from "./utils/tokenValidator.js";

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    context: ({ req }) => {
      if (req.body.query.includes("query")) {
        // no jwt validation in query
        return;
      } else if (req.body.query.includes("createUser")) {
        // no jwt validation when creating new user
        return;
      } else {
        if (req.headers && req.headers.authorization) {
          const auth = req.headers.authorization;
          const parts = auth.split(" ");
          const bearer = parts[0];
          const token = parts[1];
          console.log("token", token);
          if (bearer === "Bearer") {
            const user = tokenValidator(token);
            if (user.error) {
              return { user: null };
            } else {
              return { user };
            }
          }
        } else {
          throw Error("User must be authenticated.");
        }
      }
    },
  });

  await server.start(); // schema loaded before listening the server
  server.applyMiddleware({ app, path: "/" });

  startDB().then(async () => {
    const port = config.server.port;

    // Modified server startup
    await new Promise((resolve) => httpServer.listen({ port }, resolve));
    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    );
  });
}

startServer();
