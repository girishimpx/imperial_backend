const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates register request
 */
const validateAddMasterByAdmin = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Name required'),

  check('email')
    .not()
    .isEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Please Enter Valid Email'),

  check('password')
    .not()
    .isEmpty()
    .withMessage('Password required')
    .matches(/(^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$)+/)
    .withMessage('Password must be a minimum 8 characters & Maximum 16 characters.Eg: Abc@123')
    .isLength({
      min: 5
    })
    .withMessage('Password is Too Short'),

    check('api_key')
    .not()
    .isEmpty()
    .withMessage('Api key required'),

    check('secret_key')
    .not()
    .isEmpty()
    .withMessage('Secret key required'),

    check('api_name')
    .not()
    .isEmpty()
    .withMessage('Api Name required'),

    check('permission')
    .not()
    .isEmpty()
    .withMessage('Permission required'),


    check('exchange')
    .not()
    .isEmpty()
    .withMessage('Exchange required'),

    check('passphrase')
    .not()
    .isEmpty()
    .withMessage('Passphrase required'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateAddMasterByAdmin }
