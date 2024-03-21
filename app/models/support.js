const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Support = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Answer: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminReplyForQuery",
    }],
    Query: String,
    solved: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
Support.plugin(mongoosePaginate);
module.exports = mongoose.model("Support", Support);
