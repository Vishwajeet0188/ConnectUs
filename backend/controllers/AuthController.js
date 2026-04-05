const User = require("../models/UserModel");
const { createSecretToken } = require("../utils/SecretToken");
const bcrypt = require("bcryptjs");

// SIGNUP

module.exports.Signup = async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }
      // create user
      const user = await User.create({
      email,
      password,
      fullName,
      role
    });

    // create JWT token
    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    const { password: _, ...safeUser } = user._doc;

    res.status(201).json({
      message: "User signed up successfully",
      success: true,
      user: safeUser
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports.Login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // 🔥 create token
    const token = createSecretToken(user._id);

    // optional cookie (can keep)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    const { password: _, ...safeUser } = user._doc;

    // 🔥 IMPORTANT: send token in response
    res.status(200).json({
      token,   // ADD THIS FOR TOKEN.
      user: safeUser
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};