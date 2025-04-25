const mongoose = require("mongoose");

const friendsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    friendId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    deleteFlag: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Friends = mongoose.model("Friends", friendsSchema);

module.exports=Friends
