const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')

const { Schema } = mongoose;
const planSchema = new Schema(
  {
    plan_name:{
        type: String,
    },
    per_month: {
      type: Number,
      default: 0,
    },
    per_year: {
      type: Number,
      default: 0,
    },
    limit: {
      type: Array,
      
    },
    features: {
      type: Array,
     
    },
    user_id: {
        type: Array,
       
      },
   
  },

  { timestamps: true }
);


planSchema.plugin(mongoosePaginate)
const Plan = mongoose.model("Plan", planSchema);
module.exports = Plan;
