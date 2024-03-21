const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates verify request
 */
const validate2fa = [
    check('secret')
        .exists()
        .withMessage('secret MISSING')
        .not()
        .isEmpty()
        .withMessage('Please Enter Secret'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = { validate2fa }
