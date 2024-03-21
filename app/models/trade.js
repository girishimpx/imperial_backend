const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')

const { Schema } = mongoose;
const tradeSchema = new Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    loan_user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    trade_pair_id: {
      type: mongoose.Types.ObjectId,
    },
    asset_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Assets'
    },
    trade_type: {
      type: String,
      enum: { values: ["buy", "sell"] },
    },
    ouid: {
      type: String,
      default: null,
    },
    symbol: {
      type: String,
      default: null,
    },
    entry_price: {
      type: String,
      default: "0",
    },
    exit_price: {
      type: String,
      default: "0",
    },
    order_id: {
      type: String,
      default: null,
    },
    pair: {
      type: String,
      default: null,
    },
    order_type: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      default: null,
    },
    volume: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
    fees: {
      type: Number,
      default: 0,
    },
    instType: {
      type: String,
    },
    commission: {
      type: Number,
      default: 0,
    },
    remaining: {
      type: Number,
      default: 0,
    },
    stoplimit: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "init",
    },
    trade_at: {
      type: String,
      enum: ['spot', 'future', 'Margin']
    },
    trade_in: {
      type: String
    },
    completed_status: {
      type: Boolean,
      default: false,
    },
    posId: {
      type: String,
      default: ""
    },
    tradeId: {
      type: String,
      default: ""
    },
    posStatus: {
      type: String,
      default: "0"
    },
    priceperunit: {
      type: String,
      default: null,
    },
    leverage: {
      type: Number,
      default: null,
    },
    margin_amount: {
      type: Number,
      default: null,
    },
    margin_ratio: {
      type: Number,
      default: null,
    },
    cancel_by: {
      type: mongoose.Types.ObjectId,
      required: false
    },
    market_wallet: {
      type: mongoose.Types.ObjectId,
      ref: "wallets",
      required: false
    },
    base_wallet: {
      type: mongoose.Types.ObjectId,
      ref: "wallets",
      required: false
    },
    convert_price: {
      type: Number,
      default: 1
    },
    loan_amount: {
      type: Number,
      default: 1
    },
      entry_price:{
      type: Number,
    },
    exit_price:{
      type: Number,
    },
  },

  { timestamps: true }
);


tradeSchema.plugin(mongoosePaginate)
const trades = mongoose.model("trades", tradeSchema);
module.exports = trades;
