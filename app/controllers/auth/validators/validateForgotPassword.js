const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates forgot password request
 */
const validateForgotPassword = [
  check('email')
    .not()
    .isEmpty()
    .withMessage('Email Required')
    .isEmail()
    .withMessage('Invalid Email Address'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateForgotPassword }
