const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { Schema } = mongoose;

const FutureTradePairSchema = new mongoose.Schema(
    {
        alias: {
            type: String,
            required: true,
        },
        instFamily: {
            type: String,
            required: true,
        },
        instId: {
            type: String,
            required: true,
        },
        instType: {
            type: String,
        },
        lever: {
            type: Number,
        },
        state: {
            type: String,
        },
        tickSz: {
            type: String,
        },
        uly: {
            type: String,
            default: null,
        },
        others: {
            type: Object,
            default: {}
        }
    },
    {
        versionKey: false,
        timestamps: true,
    }
);
FutureTradePairSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("FutureTradePairs", FutureTradePairSchema);
