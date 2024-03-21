const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates change password request
 */
const validateAdminAddMessage = [
  check('message')
    .not()
    .isEmpty()
    .withMessage('Message required'),
    check('user_id')
    .not()
    .isEmpty()
    .withMessage('User Id  required'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateAdminAddMessage }
