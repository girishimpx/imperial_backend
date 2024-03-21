const { validateResult } = require('../../../middleware/utils')
const validator = require('validator')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
const validateCreateUser = [
  check('name')
    .exists()
    .withMessage('NAME MISSING')
    .not()
    .isEmpty()
    .withMessage('IS EMPTY'),
  check('email')
    .exists()
    .withMessage('EMAIL MISSING')
    .not()
    .isEmpty()
    .withMessage('IS EMPTY')
    .isEmail()
    .withMessage('EMAIL IS NOT VALID'),
  check('password')
    .exists()
    .withMessage('PASSWORD MISSING')
    .not()
    .isEmpty()
    .withMessage('IS EMPTY')
    .isLength({
      min: 5
    })
    .withMessage('PASSWORD TOO SHORT MIN 5'),
  check('role')
    .exists()
    .withMessage('ROLE MISSING')
    .not()
    .isEmpty()
    .withMessage('IS EMPTY')
    .isIn(['user', 'admin'])
    .withMessage('USER NOT IN KNOWN ROLE'),
  check('phone')
    .exists()
    .withMessage('PHONE MISSING')
    .not()
    .isEmpty()
    .withMessage('IS EMPTY')
    .trim(),
  check('city')
    .exists()
    .withMessage('CITY MISSING')
    .not()
    .isEmpty()
    .withMessage('IS EMPTY')
    .trim(),
  check('country')
    .exists()
    .withMessage('COUNTRY MISSING')
    .not()
    .isEmpty()
    .withMessage('IS EMPTY')
    .trim(),
  check('urlTwitter')
    .optional()
    .custom((v) => (v === '' ? true : validator.isURL(v)))
    .withMessage('NOT A VALID URL'),
  check('urlGitHub')
    .optional()
    .custom((v) => (v === '' ? true : validator.isURL(v)))
    .withMessage('NOT A VALID URL'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateCreateUser }
