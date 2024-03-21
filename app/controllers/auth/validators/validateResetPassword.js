const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates reset password request
 */
const validateResetPassword = [
  check('otp')
    .not()
    .isEmpty()
    .withMessage('otp required'),
    check('email')
    .not()
    .isEmpty()
    .withMessage('Email Required')
    .isEmail()
    .withMessage('Invalid Email'),
  check('new_password')
    .not()
    .isEmpty()
    .withMessage('New password required')
    .isLength({
      min: 5
    })
    .withMessage('PASSWORD_TOO_SHORT_MIN_5')
    .matches(/(^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$)+/)
    .withMessage('Password must be a minimum 8 characters & Maximum 16 characters.At least one lowercase,At least one uppercase,At least one digit and At least it should have 8 characters long.Eg: Abcd1234'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateResetPassword }
