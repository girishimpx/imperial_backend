const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates get item request
 */
const validateAssetSymbol = [
    check('symbol')
    .exists()
    .withMessage('Symbol is missing')
    .not()
    .isEmpty()
    .withMessage('Symbol is required')
    .trim(),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateAssetSymbol }
