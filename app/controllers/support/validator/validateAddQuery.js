const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates change password request
 */
const validateAddQuery = [
  check('query')
    .not()
    .isEmpty()
    .withMessage('Query required'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateAddQuery }
