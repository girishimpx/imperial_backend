const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates delete item request
 */
const validateUserTradeHistory = [
    check('instType'),
    check('ordType'),
    check('instId'),
    check('state'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = { validateUserTradeHistory }
