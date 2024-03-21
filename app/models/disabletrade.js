const mongoose = require("mongoose");

const { Schema } = mongoose;
const disabletradeSchema = new Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    follower_user_id: [
      {
        follower_id: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
        amount: {
          type: String,
          default: "0",
        },
      },
    ],
    apikey: {
      type: String,
      default: null,
    },
    trade_in: {
      type: String
    },
    status: {
      type: Boolean,
      default:true
    },
    status: {
      type: Number,
      default:0
    },
    secretkey: {
      type: String,
      default: null,
    },
    trade_base:{
      spot:Boolean,
      margin:Boolean,
      future:Boolean
    },
    api_name: {
      type: String,
      default: null,
    },
    permission: {
      type: String,
      default: null,
    },
    exchange: {
      type: String,
      enum:["imperial","binance","okx"],
      default: null,
    },
    trade_status:{
      type: String,
    default:"disable"
    },
    passphrase: {
      type: String,
      default: null,
    },
    sub_expire: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

const disabletrades = mongoose.model("disabletrades", disabletradeSchema);
module.exports = disabletrades;
