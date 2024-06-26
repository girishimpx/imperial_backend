const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates verify request
 */
const validateGetInstrumentInfo = [
   
  check('type')
    .not()
    .isEmpty()
    .withMessage('type is required'),
  check('pair')
    .not()
    .isEmpty()
    .withMessage('pair is required'),


    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = { validateGetInstrumentInfo }
