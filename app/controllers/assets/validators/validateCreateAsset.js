const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
const validateCreateAsset = [
  check('symbol')
    .exists()
    .withMessage('Symbol is missing')
    .not()
    .isEmpty()
    .withMessage('Symbol is required')
    .isAlphanumeric()
    .withMessage('Invalid format')
    .trim(),

    check('coinname')
    .exists()
    .withMessage('Coinname is missing')
    .not()
    .isEmpty()
    .withMessage('C')
    .trim(),

    check('chain')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS EMPTY')
    .isAlphanumeric()
    .withMessage('source invalid format')
    .trim(),

    check('chain')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS EMPTY')
    .isIn(['fiat','coin','erc20','bep20','trc20','trc10'])
    .withMessage('chain must be fiat | coin | erc20 | bep20 | trc20 | trc10')
    .trim(),

    check('withdraw', 'Please enter a numeric withdraw commission!')
    .optional()
    .isNumeric(),
    check('maxwithdraw', 'Please enter a numeric Max withdraw Limit!')
    .optional()
    .isNumeric(),
    check('minwithdraw', 'Please enter a numeric min withdraw Limit!')
    .optional()
    .isNumeric(),
    check('contractaddress', 'INVALID FORMAT')
    .optional()
    .isString(),
    check('abiarray', 'INVALID FORMAT')
    .optional()
    .isString(),
    check('point value', 'Please enter a valid number!')
    .optional()
    .isInt(),
    check('netfee', 'Please enter a valid number!')
    .optional()
    .isNumeric(),
    check('orderlist', 'Please enter a valid number!')
    .optional()
    .isNumeric(),
    check('image', 'INVALID FORMAT')
    .optional()
    .isString(),
    check('url', 'INVALID FORMAT')
    .optional()
    .isString(),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateCreateAsset }
