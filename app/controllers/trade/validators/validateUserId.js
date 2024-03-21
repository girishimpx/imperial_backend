const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates delete item request
 */
const validateUserID = [
  check('id')
    .not()
    .isEmpty()
    .withMessage('Id Required'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateUserID }
