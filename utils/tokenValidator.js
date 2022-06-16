import jwt from "jsonwebtoken";
import config from "./config.js";

export const tokenValidator = (token) => {
  if (token) {
    try {
      const result = jwt.verify(token, config.jwt.secret);
      return result;
    } catch (err) {
      // if there's a problem with the token, throw an error
      return { error: true, msg: "Session invalid" };
    }
  }
};
