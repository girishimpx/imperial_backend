const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')

const { Schema } = mongoose;
const StatergySchema = new Schema(
  {
    user_name: {
        type: String,
      default: null,
    },
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
    base_coin: {
      type: String,
      default: null,
    },
    order_type: {
      type: String,
      default: null,
    },
    trade_at: {
      type: String,
      enum: ['spot', 'future', 'Margin']
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
   
  },

  { timestamps: true }
);


StatergySchema.plugin(mongoosePaginate)
const statergyhistory = mongoose.model("statergyhistory", StatergySchema);
module.exports = statergyhistory;
