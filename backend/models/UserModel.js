const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["student", "professional", "parent", "admin"],
    default: "student"
  }

}, { timestamps: true });

UserSchema.pre("save", async function () {

  // don't hash again if password already hashed
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("User", UserSchema);