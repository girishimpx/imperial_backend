const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const { Schema } = mongoose;

const NetworkSchema = new Schema({
    name: String,
  });

const AssetSchema = new mongoose.Schema(
  {
    symbol: {
      type: String
    },
    coinname: {
        type: String,
        required: true
    },
    chain: {
        type: String,
        // enum : ['fiat','coin','erc20','bep20','trc20','trc10'],
        required: true
    },
    withdraw: {
        type: Number,
        default: 0
    },
    maxwithdraw: {
        type: Number,
        default: 0
    },
    minwithdraw: {
        type: Number,
        default: 0
    },
    networkList:{
        type: [NetworkSchema]
    },
    contractaddress: {
        type: String,
        required: false
    },
    abiarray: {
      type: Array,
      default : [],
      required: false
    },
    point_value: {
        type: Number,
        default: 8
    },
    decimalvalue: {
        type: Number,
        default: 8
    },
    netfee: {
        type: Number,
        default: 1
    },
    orderlist: {
        type: Number,
        default: 1
    },
    image: {
        type: String,
        default:null
    },
    url: {
        type: String,
        default:null
    },
    status: {
        type: Boolean,
        default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
)
AssetSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Assets', AssetSchema)
