const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */

const validateAdminTradeList = [
    check('findquery')
      .not()
      .isEmpty()
      .withMessage('Findquery is required'),

      (req, res, next) => {
        validateResult(req, res, next)
      }
    ]
    
    module.exports = { validateAdminTradeList }