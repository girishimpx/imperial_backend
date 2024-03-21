const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const MasterRequest = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref:"User"
    },
    reason: {
      type: String,
      default:""
    },
    status: {
      type: String,
      enum:["pending","approved","rejected"],
      default:"pending"
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)
MasterRequest.plugin(mongoosePaginate)
module.exports = mongoose.model('Master_Request', MasterRequest)