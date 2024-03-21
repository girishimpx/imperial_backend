const {
  isIDGood,
  handleError,
  buildErrObject
} = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const { checkPassword } = require('../../middleware/auth')
const { findUser, changePasswordInDB } = require('./helpers')

/**
 * Change password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const changePassword = async (req, res) => {
  try {
    const id = await isIDGood(req.user._id)
    const user = await findUser(id)
    req = matchedData(req)
    
    const isPasswordMatch = await checkPassword(req.oldPassword, user)
    if (!isPasswordMatch) {
      return handleError(res, buildErrObject(400, 'Old Password is Wrong'))
    } else {
      // all ok, proceed to change password
      const user = changePasswordInDB(id, req)
      // res.status(200).json(await )
      res.status(200).json({
        success: true,
        result:null,
        message:"Password Changed Successfully"
      })
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { changePassword }
