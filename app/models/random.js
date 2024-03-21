const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const RandomNumbers = new mongoose.Schema(
  {
    random: {
      type: Number,
     // default:0
      
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
RandomNumbers.plugin(mongoosePaginate);
module.exports = mongoose.model("RandomNumbers", RandomNumbers);
