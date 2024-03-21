const mongoose = require('mongoose')
const validator = require('validator')

const AllTickersSchema = new mongoose.Schema(

  {
    data: [{

      instId: String,
      alias: String,
      instFamily: String,
      lever: String,
      instType: String,
      image: String,
      last: String,
      lastSz: String,
      askPx: String,
      askSz: String,
      bidPx: String,
      bidSz: String,
      open24h: String,
      high24h: String,
      volCcy24h: String,
      vol24h: String,
      users_id: Array,
      ts: String,
      sodUtc0: String,
      sodUtc8: String
    }]
  },
  {
    versionKey: false,
    timestamps: true
  }
)
module.exports = mongoose.model('AllTickersend', AllTickersSchema)
