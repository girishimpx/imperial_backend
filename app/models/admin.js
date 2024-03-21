const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const mongoosePaginate = require('mongoose-paginate-v2')

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: 'EMAIL IS NOT VALID'
      },
      lowercase: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    
    twofa: {
      type: String,
      enum: ['google', 'email','mobile',null],
      default: null
    },
    role: {
      type: String,
      enum: ['superadmin', 'admin'],
      default: 'Admin'
    },
    verification: {
      type: String,
      select: false
    },
    verified: {
      type: Boolean,
      default: false
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
    loginAttempts: {
      type: Number,
      default: 0,
      select: false
    },
    blockExpires: {
      type: Date,
      default: Date.now,
      select: false
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const hash = (Admin, salt, next) => {
  bcrypt.hash(Admin.password, salt, (error, newHash) => {
    if (error) {
      return next(error)
    }
    Admin.password = newHash
    return next()
  })
}

const genSalt = (Admin, SALT_FACTOR, next) => {
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) {
      return next(err)
    }
    return hash(Admin, salt, next)
  })
}

AdminSchema.pre('save', function (next) {
  const that = this
  const SALT_FACTOR = 5
  if (!that.isModified('password')) {
    return next()
  }
  return genSalt(that, SALT_FACTOR, next)
})

AdminSchema.methods.comparePassword = function (passwordAttempt, cb) {
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) =>
    err ? cb(err) : cb(null, isMatch)
  )
}
AdminSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Admin', AdminSchema)
