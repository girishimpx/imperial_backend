const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates get item request
 */
const validateGetAssetByTradepair = [
    check('tradepair')
    .exists()
    .withMessage('Trade pair missing')
    .not()
    .isEmpty()
    .withMessage('Trade pair is required')
    .trim(),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateGetAssetByTradepair }
