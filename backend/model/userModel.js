const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,

  },
  address: {
    type: String,
    default: " "

  },
  university: {
    type: String,
    default: " "

  },
  degree: {
    type: String,
    default: " "

  },
  experience: {
    type: String,
    default: " "

  },
  company: {
    type: String,
    default: " "

  },
  position: {
    default: " ",

    type: String,
  },
  skill: {
    type: [String],
    default: []

  },
  profileImageURL: {
    type: String,
    trim: true,
    default: "https://res.cloudinary.com/dos1qtwvw/image/upload/v1705160600/user_cboknb.jpg"

  },
  followers: [],
  following: []
});
const Users = mongoose.model("users", userSchema);
module.exports = Users;
