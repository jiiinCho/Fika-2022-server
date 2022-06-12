import User from "../database/user.js";

const autehnticateUser = async (req, res, next) => {
  const user = await User.findOne({
    accessToken: req.header("Authorization"),
  }).exec();

  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).json({ message: "Invalid accessToken", loggedOut: true });
  }
};

export default autehnticateUser;
