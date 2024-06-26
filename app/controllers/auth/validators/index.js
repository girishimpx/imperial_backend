const { validateForgotPassword } = require('./validateForgotPassword')
const { validateLogin } = require('./validateLogin')
const { validateRegister } = require('./validateRegister')
const { validateResetPassword } = require('./validateResetPassword')
const { validateVerify } = require('./validateVerify')
const { validate2fa } = require('./validate2fa')
const { validateVerifyKyc } = require('./validateVerifyKyc')
const { validateAddMasterByAdmin } = require('./validateAddMasterByAdmin')
const { validateReferralAmount } = require('./validateReferralAmount')



module.exports = {
  validateForgotPassword,
  validateLogin,
  validateRegister,
  validateResetPassword,
  validateVerify,
  validate2fa,
  validateVerifyKyc,
  validateAddMasterByAdmin,
  validateReferralAmount
}
