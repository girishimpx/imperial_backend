const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
const validateinsertTradePair = [
  // check('source')
  //   .exists()
  //   .withMessage('MISSING')
  //   .not()
  //   .isEmpty()
  //   .withMessage('IS_EMPTY')
  //   .isAlphanumeric()
  //   .withMessage('source invalid format')
  //   .trim(),

  //   check('name')
  //   .exists()
  //   .withMessage('MISSING')
  //   .not()
  //   .isEmpty()
  //   .withMessage('IS_EMPTY')
  //   .trim(),

    check('tradepair')
    .exists()
    .withMessage('Trade pair is missing')
    .not()
    .isEmpty()
    .withMessage('Trade pair is required')
    .trim(),

    check('coinname1')
    .exists()
    .withMessage('Coinname1 is missing')
    .not()
    .isEmpty()
    .withMessage('Coinname1 is required')
    .trim(),

    check('coinname2')
    .exists()
    .withMessage('Coinname2 is missing')
    .not()
    .isEmpty()
    .withMessage('Coinname2 is required')
    .trim(),

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
    check('coinimage1', 'Invalid format')
    .optional()
    .isString(),
    check('coinimage2', 'Invalid format')
    .optional()
    .isString(),
    check('url', 'Invalid format')
    .optional()
    .isString(),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateinsertTradePair }
