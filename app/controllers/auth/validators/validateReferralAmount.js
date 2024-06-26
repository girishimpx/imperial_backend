const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates forgot password request
 */
const validateReferralAmount = [
    check('amount')
        .not()
        .isEmpty()
        .withMessage('Amount Required')
        .isNumeric()
        .withMessage('Enter valid number'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = { validateReferralAmount }
