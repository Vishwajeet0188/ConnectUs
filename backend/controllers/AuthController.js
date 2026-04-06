const User = require("../models/UserModel");
const { createSecretToken } = require("../utils/SecretToken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ================= SIGNUP =================

module.exports.Signup = async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
      role,
    });

    const token = createSecretToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    const { password: _, ...safeUser } = user._doc;

    res.status(201).json({
      message: "User signed up successfully",
      success: true,
      user: safeUser,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= LOGIN =================

module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = createSecretToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    const { password: _, ...safeUser } = user._doc;

    res.status(200).json({
      token,
      user: safeUser,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= GOOGLE AUTH =================

module.exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      const hashedPassword = await bcrypt.hash("google-auth", 10);

      user = await User.create({
        fullName: name,
        email,
        password: hashedPassword,
        role: "student",
        profilePic: picture, 
      });
    }

    const jwtToken = createSecretToken(user);

    // cookie (optional)
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    //  safe user outside response
    const { password: _, ...safeUser } = user._doc;

    res.status(200).json({
      success: true,
      message: "Google login successful",
      token: jwtToken,
      user: safeUser,
    });

  } catch (error) {
    console.log("Google Auth Error:", error);
    res.status(400).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};