const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const WalletSchema = new mongoose.Schema(
  {
    coinname: {
      type: String
    },
    usdValue: {
      type: String
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserSchema',
    },
    asset_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assets',
    },

    balance: {
      type: Number,
      default: 0
    },
    escrow_balance: {
      type: Number,
      default: 0
    },
    symbol: {
      type: String,
      default: ""
    },
    Entry_bal: {
      type: String,
      default: "0"
    },
    total_balance: {
      type: Number,
      default: 0
    },
    Exit_bal: {
      type: String,
      default: "0"
    },
    margin_loan: {
      type: String,
      default: "0"
    },
    url: {
      type: String,
      default: ""
    },
    max_loan: [],
    mugavari: []
  },
  {
    versionKey: false,
    timestamps: true
  }
)
WalletSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Wallet', WalletSchema)