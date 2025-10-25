import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

ChatSchema.index({ fromUserId: 1, touserId: 1 });

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;
