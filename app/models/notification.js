const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Notification = new mongoose.Schema(
  {
    for: {
      type: String,
    },
    message: {
      type: String,
    },
    reason: {
      type: String,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["good", "bad"],
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
Notification.plugin(mongoosePaginate);
module.exports = mongoose.model("Notification", Notification);
