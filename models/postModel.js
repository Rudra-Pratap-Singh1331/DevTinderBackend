import mongoose from "mongoose";
import validator from "validator";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    postPhotoUrl: {
      type: String, // Cloudinary URL
    },
    postContent: {
      type: String,
      required: true,
      set: (value) => (value ? validator.escape(value) : value),
      maxLength: 1000,
    },
    postVisibility: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

export const Post = mongoose.model("Post", postSchema);
