const uuid = require('uuid')
const User = require('../../../models/user')
const Random = require('../../../models/random')

const { buildErrObject } = require('../../../middleware/utils')
const otpGenerator = require('otp-generator')
/**
 * Registers a new user in database
 * @param {Object} req - request object
 */
const registerUser = (req = {}, random = ' ', referred_by_id) => {
  // console.log(req,"option1")

  return new Promise((resolve, reject) => {
    const user = new User({
      name: req.name,
      email: req.email,
      password: req.password,
      email_otp: req.otp,
      signup_type: req.signup_type,
      referred_by_code: req.referred_by_code,
      referred_by_id: referred_by_id,
      referral_code: random,
      verification: uuid.v4()
    })
    user.save((err, item) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      resolve(item)
    })
  })
}
const registerUsers = (req = {}, random = ' ') => {
  return new Promise((resolve, reject) => {
    const user = new User({
      name: req.name,
      email: req.email,
      password: req.password,
      email_otp: req.otp,
      signup_type: req.signup_type,
      referred_by_code: req.referred_by_code,
      referral_code: random,
      verification: uuid.v4()
    })
    user.save((err, item) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      resolve(item)
    })
  })
}
const registergoogleUsers = (userData = {}, random = ' ') => {
  return new Promise((resolve, reject) => {
    const user = new User({
      name: userData.name,
      email: userData.email,
      email_otp: userData.otp,
      signup_type: userData.signup_type,
      referral_code: random,
      isgoogle: "true",
      verification: uuid.v4()
    })
    user.save((err, item) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      resolve(item)
    })
  })
}

const randomNumber = async () => {
  const randoms = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false
  })

  const randomSchema = await Random.findOne({ random: randoms })
  if (!randomSchema) {
    await Random.create({ random: randoms })
    return randoms
  }
  else {

    return randomNumber()
  }
}
module.exports = { registerUser, randomNumber, registerUsers, registergoogleUsers }
