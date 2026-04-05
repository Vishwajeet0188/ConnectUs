require("dotenv").config();
const jwt = require("jsonwebtoken"); //  IMPORTANT

module.exports.createSecretToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.TOKEN_KEY,
    {
      expiresIn: "1h"
    }
  );
};