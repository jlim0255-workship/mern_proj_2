// from codesistency github gist
import mongoose from "mongoose";

// for the model, we are sending 2 objects
// 1. all of the fields that we want in the model
// 2. optional timestamps field
const friendRequestSchema = new mongoose.Schema(
    // every friend request has a sender, recipient, and status
  {
    // sender will be a userId
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // recipient will be a userId
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted"], // only allow these values
      default: "pending", //no rejected request for now
    },
  },
  {
    timestamps: true,
  }
);

// based on the schema, create a model
const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;