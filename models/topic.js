import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      enum: ["jj", "kay", "kory", "james"],
    },
    avatar: String,
  },
  { timestamps: true }
);

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subreddit: {
      type: String,
      required: true,
      default: "general",
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    comments: [commentSchema],
    userUpvoted: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    userDownvoted: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

const subredditSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    icon: String,
    memberCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const User =
  mongoose.models.User || mongoose.model("User", userSchema);
const Post =
  mongoose.models.Post || mongoose.model("Post", postSchema);
const Subreddit =
  mongoose.models.Subreddit || mongoose.model("Subreddit", subredditSchema);
const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export { User, Post, Subreddit, Comment };