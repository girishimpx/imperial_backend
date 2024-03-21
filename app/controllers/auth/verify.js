const { matchedData } = require('express-validator')
const { verificationExists, verifyUser } = require('./helpers')
const User = require('../../models/user')

const { handleError } = require('../../middleware/utils')

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const verify = async (req, res) => {
  try {
    req = matchedData(req)
    // const user = await verificationExists(req.id)
    // const result = await verifyUser(user)
    const response = await User.findOne({ email: req.email })
    if (response) {
      if (response.email_otp === req.otp) {
        await User.findByIdAndUpdate({ _id: response._id }, { email_verify: "true" })
        res.status(200).json({
          success: true,
          result: null,
          message: "OTP Verified Successfully"
        })
      } else {
        res.status(200).json({
          success: true,
          result: response,
          message: "Invalid OTP"
        })
      }

    } else {
      res.status(400).json({
        success: false,
        result: null,
        message: "Invalid Email"
      })
    }

  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { verify }
