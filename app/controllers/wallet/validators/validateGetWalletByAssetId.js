const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates get item request
 */
const validateGetWalletByAssetId = [
    check('asset_id')
      .exists()
      .withMessage('Assetid is missing')
      .not()
      .isEmpty()
      .withMessage('Assetid is required'),
    (req, res, next) => {
      validateResult(req, res, next)
    }
  ]
  
  module.exports = { validateGetWalletByAssetId }