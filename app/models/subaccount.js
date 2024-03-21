const mongoose = require("mongoose");

const { Schema } = mongoose;
const subaccountSchema = new Schema(
    {
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        label: {
            type: String,
            default: null,
        },
        subAcct: {
            type: String,
            default: null,
        },
        ts: {
            type: String,
            default: null
        },
        uid: {
            type: String,
            default: null
        },
        acctLv: {
            type: String,
            default: 0,
        },
    },

    { timestamps: true }
);

const subaccount = mongoose.model("subaccount", subaccountSchema);
module.exports = subaccount;
