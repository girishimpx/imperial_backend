const mongoose = require("mongoose");

const { Schema } = mongoose;
const referralSchema = new Schema(
    {
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        referral_id: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        referral_code: {
            type: Number
        },
        is_deposit: {
            type: Boolean,
            default: false
        },
        is_copytrade: {
            type: Boolean,
            default: false
        },
        amount: {
            type: Number,
            default: 0
        },
        is_reward: {
            type: Number,
            enum: [0, 1, 2]
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('referral', referralSchema)
