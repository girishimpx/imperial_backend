const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const AdminReply = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Support",
    },
    Reply: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
AdminReply.plugin(mongoosePaginate);
module.exports = mongoose.model("AdminReplyForQuery", AdminReply);
