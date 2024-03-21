const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates delete item request
 */
const validateCancelTrade = [
  check('instId')
    .exists()
    .withMessage('InstId Required')
    .not()
    .isEmpty()
    .withMessage('Id Required'),
  check('ordId')
    .exists()
    .withMessage('ordId Required')
    .not()
    .isEmpty()
    .withMessage('ordId Required'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateCancelTrade }
