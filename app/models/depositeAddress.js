const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')

const { Schema } = mongoose;
const depositeAddressSchema = new Schema(
    {
        name:{
            type: String
        },
        ccy: {
            type: String,
        },
        chain: {
            type: String,
        },
        subAcct: {
            type: String,
        },
        addr: {
            type: String,
        },
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: 'users'
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)
module.exports = mongoose.model('depositeaddress', depositeAddressSchema)