const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates delete item request
 */
const ValidateBUySellinAdmin = [
  check('order_type')
    .not()
    .isEmpty()
    .withMessage('Order type Required'),
  check('pair')
    .not()
    .isEmpty()
    .withMessage('Pair Required'),
  check('trade_type')
    .not()
    .isEmpty()
    .withMessage('Trade type Required'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { ValidateBUySellinAdmin }
