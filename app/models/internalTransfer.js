const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { Schema } = mongoose;

const InternalTransferSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        Amount: {
            type: String,
            required: true,
        },
        Currency: {
            type: String,
            required: true,
        },
        from: {
            type: String,
        },
        to: {
            type: String,
        }
    },
    {
        versionKey: false,
        timestamps: true,
    }
);
InternalTransferSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("InternalTransfers", InternalTransferSchema);
