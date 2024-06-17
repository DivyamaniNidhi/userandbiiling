const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const isAuthenticated = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized");
  }
};

module.exports = isAuthenticated;
