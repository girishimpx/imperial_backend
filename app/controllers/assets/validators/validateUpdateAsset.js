const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
const validateUpdateAsset = [
    check('id')
    .exists()
    .withMessage('Id is missing')
    .not()
    .isEmpty()
    .withMessage('Id is required'),
  check('source')
    .exists()
    .withMessage('Source is missing')
    .not()
    .isEmpty()
    .withMessage('Source is required')
    .isAlphanumeric()
    .withMessage('Invalid format')
    .trim(),

    check('coinname')
    .exists()
    .withMessage('Coinname is missing')
    .not()
    .isEmpty()
    .withMessage('Coinname is required')
    .trim(),

    // check('chain')
    // .exists()
    // .withMessage('Chain is missing')
    // .not()
    // .isEmpty()
    // .withMessage('Chain is required')
    // .isAlphanumeric()
    // .withMessage('Invalid format')
    // .trim(),

    check('chain')
    .exists()
    .withMessage('Chain is missing')
    .not()
    .isEmpty()
    .withMessage('Chain is required')
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
    check('contractaddress', 'Invalid format')
    .optional()
    .isString(),
    check('abiarray', 'Invalid format')
    .optional()
    .isString(),
    check('point_value', 'Please enter a valid number!')
    .optional()
    .isInt(),
    check('netfee', 'Please enter a valid number!')
    .optional()
    .isNumeric(),
    check('orderlist', 'Please enter a valid number!')
    .optional()
    .isNumeric(),
    check('image', 'Invalid format')
    .optional()
    .isString(),
    check('url', 'Invalid format')
    .optional()
    .isString(),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateUpdateAsset }
