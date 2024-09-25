const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  liked: {
    type: Boolean,
    default: false,
  },

  likeCount: {
    type: Number,
  },
  comments: [
    {
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      comment: {
        type: String,
      },
      created: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  postImageURL: {
    type: String,
    trim: true,
  },
});

const Posts = mongoose.model("posts", postSchema);
module.exports = Posts;
