const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')

const { Schema } = mongoose;
const assetIconSchema = new Schema(
  {
    ccy: {
      type: String,
    },

    image: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
)
module.exports = mongoose.model('AssetIcon', assetIconSchema)