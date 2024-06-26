const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates verify request
 */
const validateUserTrade = [
    check('instId')
    .not()
    .isEmpty()
    .withMessage('InstId is required'),
    check('istpsl')
    .optional(),
    check('slPrice')
    .optional(),
    check('tpPrice')
    .optional(),
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
    check('price').optional(),
    check('tdMode').optional(),
    check('tpPrice').optional(),
    check('slPrice').optional(),

    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = { validateUserTrade }
