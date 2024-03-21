const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Ratings = new mongoose.Schema(
  {
    master_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    user_id: [{
        _id : {
          type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        },
        rating:{
          type:Number
      },
    }
    ],
    total_ratings:{
        type:Number
    },
    average_ratings:{
        type:Number
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
Ratings.plugin(mongoosePaginate);
module.exports = mongoose.model("Ratings", Ratings);
