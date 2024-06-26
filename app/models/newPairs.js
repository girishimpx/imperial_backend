const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");


const newPairSchema = new mongoose.Schema(
  {
  
    symbol: {
      type: String
    },
    baseCoin: {
      type: String
    },
    quoteCoin: {
      type: String
    },
    status: {
      type: String
    },
    marginTrading: {
      type: String
    },
    category: {
      type: String
    },
    users_id: {
      type: Array
    },
    imageurl: {
      type: String,
      default: null,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
newPairSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("newPair", newPairSchema);
