const { matchedData } = require('express-validator')
const mongoose = require('mongoose');
const User = require('../../models/user')
const { registerUser,setUserInfo, returnRegisterToken } = require('./helpers')
const jwt_decode = require("jwt-decode")
const { randomNumber } = require('../auth/helpers/registerUser')
const { saveUserAccessAndReturnToken } = require('../auth/helpers/saveUserAccessAndReturnToken')
const { registergoogleUsers } = require('../auth/helpers/registerUser')
const { generateToken } = require('../auth//helpers/generateToken')
const { handleError } = require('../../middleware/utils')
const {
  emailExists,gemailExists,
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
const googleRegister = async (req, res) => {
  try {
   console.log("Credential",req.body.cred)
   var decoded = jwt_decode(req.body.cred);
   console.log(decoded);
   const userData = {}
  const doesEmailExists = await gemailExists(decoded.email)
  userData.email = decoded.email
  userData.name  =decoded.name
  console.log(doesEmailExists,"email Exist")
  if (doesEmailExists) {
    const user = await User.findOneAndUpdate({email:decoded.email},{isgoogle:"true"})
    const response = await saveUserAccessAndReturnToken(req, user)
    res.status(200).json({
        success: true,
        result: response,
        message: "Logged in successfully"
      })

  }
  else{
    userData.otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
      })

      const random_number = await randomNumber()
      console.log("random_number====>", random_number)
      console.log("userData")
         const item = await registergoogleUsers(userData, random_number)
   // const userInfo = await setUserInfo(item)
   const user = await User.findOne({email:decoded.email})
   const response = await saveUserAccessAndReturnToken(req, user)
   res.status(200).json({
       success: true,
       result: response,
       message: "Logged in successfully"
     })
    res.status(200).json({
        success: true,
        result: userData,
        message: " Register not"
      })
   
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

module.exports = { googleRegister }
