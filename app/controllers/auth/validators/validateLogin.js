const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates register request
 */
/**
 * Validates login request
 */
const validateLogin = [
  check('email')
    .exists()
    .withMessage('email MISSING')
    .not()
    .isEmpty()
    .withMessage('Please Enter Email')
    .isEmail()
    .withMessage('Please Enter Valid Email'),
  check('password')
    .exists()
    .withMessage('password MISSING')
    .not()
    .isEmpty()
    .withMessage('Please Enter Password'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateLogin }
