const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const mongoosePaginate = require('mongoose-paginate-v2')
const { isValidObjectId } = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: 'EMAIL IS NO VALID'
      },
      lowercase: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      select: false
    },
    referal_money: {
      type: Number,
      default: 0
    },
    referral_code: {
      type: String,
    },
    referred_by_code: {
      type: String,
    },
    referred_by_id: {
      type: mongoose.Types.ObjectId,
    },
    iseligible: {
      type: String,
      enum: ['completed', 'Approved', 'not_eligible' ,'null'],
      default: 'null'
    },
    referaldeposit:{
      type : String,
      enum: ['eligible', 'not_eligible' ,'null'],
      default: 'null',
    },
    redeem_points: {
      type: String,
      default: '0',
    },
    twofa: {
      type: String,
      enum: ['google', 'email', 'mobile', 'null'],
      default: 'null'
    },
    signup_type: {
      type: String,
      enum: ['google', 'gmail', 'mobile', 'null'],
      default: 'null'
    },
    kyc_verify: {
      type: Boolean,
      default: false,
    },
    f2A_creds: {
      type: Object,
      default: {}
    },
    f2A_Status: {
      type: String,
      default: "false"
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    verification: {
      type: String
    },
    verified: {
      type: String,
      default: "false"
    },
    isgoogle: {
      type: String,
      default: "false"
    },
    ispaid: {
      type: String,
      default: "false"
    },
    issubscribed: {
      type: String,
      default: "false"
    },
    block_reason: {
      type: String,
      default: ""
    },
    email_verify: {
      type: String,
      default: "false"
    },
    email_otp: {
      type: String,
      default: "null"
    },
    phone: {
      type: String
    },
    city: {
      type: String
    },
    country: {
      type: String
    },
    forgotOtp: {
      type: String,
      default: "null"
    },
    loginAttempts: {
      type: Number,
      default: 0,
      select: false
    },
    blockExpires: {
      type: Date,
      default: Date.now,
      select: false
    },
    withdrawOtp: {
      type: Number
    },
    trader_type: {
      type: String,
      enum: ["user", "master"],
      default: 'user'
    },
    suspend: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 0
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const hash = (user, salt, next) => {
  bcrypt.hash(user.password, salt, (error, newHash) => {
    if (error) {
      return next(error)
    }
    user.password = newHash
    return next()
  })
}

const genSalt = (user, SALT_FACTOR, next) => {
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) {
      return next(err)
    }
    return hash(user, salt, next)
  })
}

UserSchema.pre('save', function (next) {
  const that = this
  const SALT_FACTOR = 5
  if (!that.isModified('password')) {
    return next()
  }
  return genSalt(that, SALT_FACTOR, next)
})

UserSchema.methods.comparePassword = function (passwordAttempt, cb) {
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) =>
    err ? cb(err) : cb(null, isMatch)
  )
}
UserSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('User', UserSchema)
