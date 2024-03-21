const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates verify request
 */
const validateVerify = [
  check('email')
    .exists()
    .withMessage('email MISSING')
    .not()
    .isEmpty()
    .withMessage('Please Enter Email'),
  check('otp')
    .exists()
    .withMessage('otp MISSING')
    .not()
    .isEmpty()
    .withMessage('Please Enter OTP'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateVerify }
