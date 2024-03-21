const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates change password request
 */
const validateAddMessage = [
  check('message')
    .not()
    .isEmpty()
    .withMessage('Message required'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateAddMessage }
