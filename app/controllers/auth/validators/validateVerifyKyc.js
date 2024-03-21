const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates verify request
 */
const validateVerifyKyc = [
    check('_id')
        .exists()
        .withMessage('user_id MISSING')
        .not()
        .isEmpty()
        .withMessage('Please Enter User Id'),
    check('status')
        .exists()
        .withMessage('status MISSING')
        .not()
        .isEmpty()
        .withMessage('Please Enter Status'),
    check('reason')
        .exists()
        .withMessage('reason MISSING')
        .not()
        .isEmpty()
        .withMessage('Please Enter Reason'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = { validateVerifyKyc }