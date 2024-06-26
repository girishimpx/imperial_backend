const mongoose = require("mongoose");

const { Schema } = mongoose;
const referralAmount = new Schema(
    {
        amount: {
            type: Number,
            default: 0
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('referralAmount', referralAmount)

