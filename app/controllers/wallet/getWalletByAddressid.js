// const { getItemById } = require('../../middleware/db')
const deposit = require('../../models/depositeAddress')
// const asset = require('../../models/assets')
const { handleError } = require('../../middleware/utils')
// const { matchedData } = require('express-validator')
// const getBalance = require('./getBalanceUsdt')

const getWalletByAddressid = async (req, res) => {
    try {
        const user = req.user
        // req = matchedData(req)
        const data = await deposit.find({ $and: [{ user_id: user._id }, { ccy: req.body.ccy }] })
        if (data.length > 0) {
            res.status(200).json({
                success: true,
                result: data,
                message: 'Address found'
            })
        } else {
            res.status(200).json({
                success: false,
                result: null,
                message: 'Address not found'
            })
        }
    } catch (error) {
        handleError(res, error)
    }
};
module.exports = { getWalletByAddressid };


