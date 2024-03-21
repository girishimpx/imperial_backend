const { matchedData } = require('express-validator')
const mongoose = require('mongoose');
const User = require('../../models/user')
const { registerUser, setUserInfo, returnRegisterToken } = require('./helpers')
const { randomNumber } = require('./helpers/registerUser')
const { registerUsers, registergoogleUsers } = require('./helpers/registerUser')
const { saveUserAccessAndReturnToken } = require('./helpers/saveUserAccessAndReturnToken')
const { generateToken } = require('./helpers/generateToken')
const { handleError } = require('../../middleware/utils')
const {
  emailExists,
  gemailExists,
  sendRegistrationEmailMessage
} = require('../../middleware/emailer')
const otpGenerator = require('otp-generator')
const ejs = require('ejs')
const path = require('path')
/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const register = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'

    let referred_by_id = new mongoose.Types.ObjectId()

    if (req.body.signup_type === "gmail") {
      const locale = req.getLocale()
      req = matchedData(req)
      const doesEmailExists = await emailExists(req.email)
      if (!doesEmailExists) {
        req.otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false
        })

        const random_number = await randomNumber()
        if (req.referred_by_code !== undefined) {
          const findCri = {
            referral_code: req.referred_by_code
          }
          const refer = await User.findOne(findCri)

          if (refer !== null) {
            referred_by_id = refer._id
            await User.findByIdAndUpdate({ _id: refer._id }, { referal_money: (Number(refer.referal_money) + 5).toString() })
            // console.log("refer Id", referred_by_id)
            // console.log(req, random_number, referred_by_id)
            const item = await registerUser(req, random_number, referred_by_id)
            const userInfo = await setUserInfo(item)
            const filedata = path.join(__dirname, '../../../views/verify.ejs')
            const response = await generateToken(item._id)


            ejs.renderFile(
              filedata,
              { username: item.name, url: `https://app.imperialx.exchange/tokenpage/${response}` },
              async (err, str) => {
                if (err) {
                  return err
                } else {
                  await sendRegistrationEmailMessage(locale, item, str)
                }
              }
            )


            return res.status(200).json({
              success: true,
              result: userInfo,
              message: "Registred Successfully"
            })
          }
          else if (refer === null) {
            return res.status(201).json({
              success: false,
              message: "Invalid Referral Id"
            })
          }
        }

        else {

          const item = await registerUsers(req, random_number)
          const userInfo = await setUserInfo(item)
          const filedata = path.join(__dirname, '../../../views/verify.ejs')
          const response = await generateToken(item._id)


          ejs.renderFile(
            filedata,
            { username: item.name, url: `https://app.imperialx.exchange/tokenpage/${response}` },
            async (err, str) => {
              if (err) {
                return err
              } else {
                await sendRegistrationEmailMessage(locale, item, str)
              }
            }
          )

          // const response = await returnRegisterToken(item, userInfo)
          // sendRegistrationEmailMessage(locale, item)
          return res.status(200).json({
            success: true,
            result: userInfo,
            message: "Registred Successfully"
          })
        }



      }
    }
    else if (req.body.signup_type === "google") {

      const doesEmailExists = await gemailExists(req.body.email)
      if (!doesEmailExists) {
        req.body.otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false
        })
        const userData = {}
        userData.email = req.body.email
        userData.name = req.body.name
        userData.otp = req.body.otp
        userData.signup_type = req.body.signup_type
        const random_number = await randomNumber()
        const item = await registergoogleUsers(userData, random_number)
        // const userInfo = await setUserInfo(item)
        const user = await User.findOne({ email: userData.email })
        const response = await saveUserAccessAndReturnToken(req, user)
        res.status(200).json({
          success: true,
          result: response,
          message: "Logged in successfully"
        })
      }
      else {
        //const user = await User.findOneAndUpdate({email:req.body.email},{isgoogle:"true"})
        const user = await User.findOne({ email: req.body.email })
        const response = await saveUserAccessAndReturnToken(req, user)
        res.status(200).json({
          success: true,
          result: response,
          message: "Logged in successfully"
        })
        // return res.status(400).json({
        //   success: true,
        //   result: null,
        //   message: "Email already Registerd"
        // })
      }
    }
  } catch (error) {
    handleError(res, error)
    res.status(200).json({
      success: false,
      result: error,
      message: "Not Registerd"
    })
  }
}

module.exports = { register }
