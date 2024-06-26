const { matchedData } = require('express-validator')
const { verificationExists, verifyUser } = require('./helpers')
const User = require('../../models/user')

const { handleError } = require('../../middleware/utils')

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const verifyEmail = async (req, res) => {
  try {
    const user = req.user


    console.log(user, '*******************');
    if (user?.email_verify == "true") {
      res.status(201).json({
        success: false,
        result: "",
        message: "Email Already verified"
      })
    } else {
      if (user?.email_verify == 'false') {
        await User.findByIdAndUpdate({ _id: user?._id }, { email_verify: "true" })
        res.status(200).json({
          success: true,
          result: user?._id, user,
          message: "Email Verified Successfully"
        })
      } else {
        res.status(201).json({
          success: false,
          result: "",
          message: "Email verify Failed"
        })
      }
    }


  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { verifyEmail }
