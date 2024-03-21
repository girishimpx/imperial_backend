const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates get item request
 */
const validatecreateWallet = [
    check('user_id')
      .exists()
      .withMessage('UserId is missing')
      .not()
      .isEmpty()
      .withMessage('UserId is required'),
    (req, res, next) => {
      validateResult(req, res, next)
    }
  ]
  
  module.exports = { validatecreateWallet }