const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates get item request
 */
const validateUpdateWallet = [
    check('asset_id')
      .exists()
      .withMessage('Assetid is missing')
      .not()
      .isEmpty()
      .withMessage('Assetid is required'),
      check('balance')
      .exists()
      .withMessage('Balance is missing')
      .not()
      .isEmpty()
      .withMessage('Balance is required'),
      check('escrow_balance')
      .exists()
      .withMessage('Escrow balance is missing')
      .not()
      .isEmpty()
      .withMessage('Escrow balance is required'),
    (req, res, next) => {
      validateResult(req, res, next)
    }
  ]
  
  module.exports = { validateUpdateWallet }