import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import bcrypt from "bcrypt";

import startDB from "./database/database.js";
import User from "./database/user.js";

import { dbErrorHandler } from "./middleware/dbErrorHandler.js";
import autehnticateUser from "./middleware/authUser.js";

const port = process.env.PORT || 8080;
const hashSaltRounds = 10;
const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(dbErrorHandler);

app.get("/", (req, res) => {
  const landing = {
    about: "Welcome to My Auth API😻",
    APIs: listEndpoints(app),
  };
  res.send(landing);
});

// @ desc     Create new account
// @ route    POST /signup
// @ payload  username, email, password
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password: plainPassword } = req.body;

    if (!username || !email || !plainPassword) {
      res
        .status(400)
        .json({ message: "username, email and password fields required" });
    } else {
      const found = await User.findOne({ username });
      if (found) {
        res.status(400).json({ message: `${username} already exist` });
      } else {
        const password = bcrypt.hashSync(plainPassword, hashSaltRounds);
        await new User({ username, email, password }).save(function (
          err,
          result
        ) {
          if (err) {
            res
              .status(400)
              .json({ message: "Could Not Create User", errors: err.message });
          } else {
            result &&
              res
                .status(201)
                .json({ id: result._id, accessToken: result.accessToken });
          }
        });
      }
    }
  } catch (err) {
    console.error(e);
    res
      .status(400)
      .json({ message: "Could Not Create User", errors: err.message });
  }
});

// @ desc     login
// @ route    POST /login
// @ payload  username, password
app.post("/login", async (req, res) => {
  const { password, username } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username, password fields required" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log("user not found");
      return res
        .status(400)
        .json({ message: "Incorrect Username or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect Username or password" });
    }

    return res
      .status(200)
      .json({ id: user._id, accessToken: user.accessToken });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// @ desc     show secret content
// @ route    GET /secret
// @ header   Authorization
app.get("/secret", autehnticateUser, (req, res) => {
  res.json({
    username: req.user.username,
    secret: "https://giphy.com/embed/Z9WQLSrsQKH3uBbiXq",
  });
});

startDB().then(
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  })
);
