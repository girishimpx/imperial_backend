const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates get item request
 */
const validateGetUser = [
  check('id')
    .not()
    .isEmpty()
    .withMessage('Id required'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateGetUser }
