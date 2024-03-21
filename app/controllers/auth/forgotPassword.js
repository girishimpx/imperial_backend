const { matchedData } = require('express-validator')
const {
  findUser,
  forgotPasswordResponse,
  saveForgotPassword
} = require('./helpers')
const user = require('../../models/user')
const { handleError } = require('../../middleware/utils')
const { sendResetPasswordEmailMessage } = require('../../middleware/emailer')

const { sendEmail } = require('../../middleware/emailer/sendEmail')

const path = require('path')
const ejs = require('ejs')
/**
 * Forgot password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */


function generateRandomNumber() {
  let randomNum = Math.random()
  randomNum *= 1000000
  randomNum = Math.floor(randomNum)
  return randomNum

}

const callback = async (data) => {
  console.log(data, "Email Status")
}


const forgotPassword = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    const data = matchedData(req)
    const userdetail = await findUser(data.email)
    const code = generateRandomNumber()


    const store = await user.findByIdAndUpdate({ _id: userdetail._id }, { forgotOtp: code }, async (err, done) => {

      if (err) {
        res.status(400).json({
          success: false,
          result: "",
          message: "otp didn't send"
        })
      }
      if (done) {
        const filedata = path.join(__dirname, '../../../views/Forgotpassword.ejs')
        await ejs.renderFile(
          filedata,
          {
            otp: code,
            username: userdetail.name,
          },
          async (err, str) => {
            if (err) {
              return response(res, 404, false, 'Email not send')
            } else {
              const data = {
                user: {
                  name: userdetail?.name,
                  email: userdetail?.email
                },
                subject: `IMPERIALX Forgot Password OTP `,
                htmlMessage: str
              }

              await sendEmail(data, callback)
              res.status(200).json({
                success: true,
                result: "",
                message: "otp sent successfully"
              })
            }
          }
        )

      }

    })




  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { forgotPassword }
