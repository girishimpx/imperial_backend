const { matchedData } = require('express-validator')

const {
  findUser,
  userIsBlocked,
  checkLoginAttemptsAndBlockExpires,
  passwordsDoNotMatch,
  saveLoginAttemptsToDB,
  saveUserAccessAndReturnToken
} = require('./helpers')

const { handleError } = require('../../middleware/utils')
const { checkPassword } = require('../../middleware/auth')
const USERS = require('../../models/user')

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const login = async (req, res) => {
  try {
    const data = matchedData(req)
    const user = await findUser(data.email)
    const suspendcheck = await USERS.findOne({ email: data.email })
    console.log(user, "users")
    if (user.email_verify === "true") {      
      if (suspendcheck.suspend == true) {

        res.status(400).json({
          success: false,
          result: "",
          message: "you can't login,You're suspended by admin"
        })

      } else {

        await userIsBlocked(user)
        await checkLoginAttemptsAndBlockExpires(user)
        const isPasswordMatch = await checkPassword(data.password, user)
        if (!isPasswordMatch) {
          handleError(res, await passwordsDoNotMatch(user))
        } else {
          user.loginAttempts = 0
          await saveLoginAttemptsToDB(user)
          
          const response = await saveUserAccessAndReturnToken(req, user)
          res.status(200).json({
            success: true,
            result: response,
            message: "Logged in successfully"
          })
        }


      }


    } else {
      res.status(400).json({
        success: false,
        result: null,
        message: "Please Verify Email"
      })
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { login }
