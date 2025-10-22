import mongoose, { mongo } from "mongoose";

const postLikeModel = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

postLikeModel.index({ postId: 1, userId: 1 }, { unique: true });

const PostLike = mongoose.model("PostLike", postLikeModel);
export default PostLike;
