const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates get item request
 */
const validateGetAssetPairbyId = [
  check('id')
    .exists()
    .withMessage('Id is missing')
    .not()
    .isEmpty()
    .withMessage('Id is required'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateGetAssetPairbyId }
