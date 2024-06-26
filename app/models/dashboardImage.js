const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')

const { Schema } = mongoose;
const dashboardImage = new Schema(
    {
        name:{
            type: String
        },
        image:{
            type: String
        },
        status:{
            type:Boolean,
            default: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)
module.exports = mongoose.model('dashboardImage', dashboardImage)