const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates register request
 */
const validateRegister = [
  check('name')
    .exists()
    .withMessage('name MISSING')
    .not()
    .isEmpty()
    .withMessage('Please Enter Name'),

  check('referred_by_code'),
  check('signup_type'),


  check('email')
    .exists()
    .withMessage('email MISSING')
    .not()
    .isEmpty()
    .withMessage('Please Enter Email')
    .isEmail()
    .withMessage('Please Enter Valid Email'),
    check('password'),

  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateRegister }
