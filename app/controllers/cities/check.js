const { handleError } = require('../../middleware/utils')
const { getAllItemsFromDB } = require('./helpers')
const wallet = require('../../models/wallet')

/**
 * Get all items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const check = async (req, res) => {
    try {
        const resp = await wallet.findOneAndUpdate({ user_id: '64ca2c9bc7923a34bc463b5d', symbol: 'ETH', 'max_loan.side': "buy" }, { $set: { 'max_loan.$.maxLoan': "1" } })
        res.json({
            result: resp
        })
    } catch (error) {
        handleError(res, error)
    }
}

module.exports = { check }
