const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Support1 = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Query: [{
        author:String,
        message:String,
        time:String,
    }],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
Support1.plugin(mongoosePaginate);
module.exports = mongoose.model("SupportChat", Support1);
