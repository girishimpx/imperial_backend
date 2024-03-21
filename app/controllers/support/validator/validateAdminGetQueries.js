const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates change password request
 */
const validateAdminGetQuery = [
  check('id')
    .not()
    .isEmpty()
    .withMessage('Id required'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateAdminGetQuery }
