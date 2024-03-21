const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { Schema } = mongoose;

const NetworkSchema = new Schema({
  name: String,
});

const TradePairSchema = new mongoose.Schema(
  {
    tradepair: {
      type: String,
      required: true,
    },
    coinname1: {
      type: String,
      required: true,
    },
    coinname2: {
      type: String,
      required: true,
    },
    chain: {
      type: String,
      enum: ["fiat", "coin", "erc20", "bep20", "trc20", "trc10"],
      // required: true,
    },
    market_asset: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
    },
    base_asset: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
    },

    withdraw: {
      type: Number,
      default: 0,
    },
    maxwithdraw: {
      type: Number,
      default: 0,
    },
    minwithdraw: {
      type: Number,
      default: 0,
    },
    networkList: {
      type: [NetworkSchema],
    },
    contractaddress: {
      type: String,
      required: false,
    },
    abiarray: {
      type: Array,
      default: [],
      required: false,
    },
    point_value: {
      type: Number,
      default: 8,
    },
    decimalvalue: {
      type: Number,
      default: 8,
    },
    netfee: {
      type: Number,
      default: 1,
    },
    orderlist: {
      type: Number,
      default: 1,
    },
    url: {
      type: String,
      default: null,
    },
    coinimage1: {
      type: String,
      default: null,
    },
    coinimage2: {
      type: String,
      default: null,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
TradePairSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("TradePairs", TradePairSchema);
