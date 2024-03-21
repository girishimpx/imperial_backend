const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates delete item request
 */
const validateSuspend = [
  check('id')
    .not()
    .isEmpty()
    .withMessage('Id Required'),
  check('suspend')
    .not()
    .isEmpty()
    .withMessage('Suspend Required').isIn(["true","false"]).withMessage('Invalid suspend '),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateSuspend }
