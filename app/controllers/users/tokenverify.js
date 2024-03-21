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
    
    
    
    
      if (user?.verified) {
        await User.findByIdAndUpdate({ _id: user?._id }, { email_verify: "true" })
        res.status(200).json({
          success: true,
          result: user?._id,
          message: "Email Verified Successfully"
        })
      } else {
        res.status(400).json({
          success: false,
          result: "",
          message: "Email verify Failed"
        })
      }

    

  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { verifyEmail }
