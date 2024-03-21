const { matchedData } = require('express-validator')

const {
  findAdmin,
  userIsBlocked,
  checkLoginAttemptsAndBlockExpires,
  passwordsDoNotMatch,
  saveLoginAttemptsToDB,
  saveAdminAccessAndReturnToken
} = require('./helpers')

const { handleError } = require('../../middleware/utils')
const { checkPassword } = require('../../middleware/auth')

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const loginByAdmin = async (req, res) => {
  try {
    const data = matchedData(req)

    const admin = await findAdmin(data.email)
    await userIsBlocked(admin)
    await checkLoginAttemptsAndBlockExpires(admin)
    const isPasswordMatch = await checkPassword(data.password, admin)
    if (!isPasswordMatch) {
      handleError(res, await passwordsDoNotMatch(admin))
    } else {
      // all ok, register access and return token
      admin.loginAttempts = 0
      await saveLoginAttemptsToDB(admin)
      const response = await saveAdminAccessAndReturnToken(req, admin)
      res.status(200).json({
        success: true,
        result: response,
        message: "Logged In Successfully"
      })
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { loginByAdmin }
