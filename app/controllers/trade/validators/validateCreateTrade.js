const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
const validateCreateTrade = [
  check('instId')
    .not()
    .isEmpty()
    .withMessage('InstId is required'),
  check('tdMode')
    .not()
    .isEmpty()
    .withMessage('tdMode is required'),
  check('ccy')
    .not()
    .isEmpty()
    .withMessage('ccy is required'),
  // check('tag')
  //   .not()
  //   .isEmpty()
  //   .withMessage('Tag is required'),
  check('side')
    .not()
    .isEmpty()
    .withMessage('Side is required'),
  check('orderType')
    .not()
    .isEmpty()
    .withMessage('OrderType is required'),
    check('px')
    .not()
    .isEmpty()
    .withMessage('Px is required'),
  check('sz')
    .not()
    .isEmpty()
    .withMessage('Sz is required'),
  check('trade_at')
    .not()
    .isEmpty()
    .withMessage('trade_at is required'),
    check('lever')
    .not()
    .isEmpty()
    .withMessage('leverage is required'),
    check('market').optional(),

    

  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateCreateTrade }
