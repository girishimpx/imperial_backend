const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates change password request
 */
const Validate_Admin_Reply = [
  check('queryId')
    .not() 
    .isEmpty()
    .withMessage('QueryId required'),
  check('reply')
    .not() 
    .isEmpty()
    .withMessage('Reply required'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { Validate_Admin_Reply }
