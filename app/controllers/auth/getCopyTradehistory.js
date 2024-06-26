const copytrade = require('../../models/copytradehistory')
const { handleError } = require('../../middleware/utils')

const getCopyTradeHistory = async (req, res) => {
    try {
        const data = await copytrade.countDocuments()
        if (data) {
            res.status(200).json({
                success: true,
                message: "success",
                result: data
            })
        }
        else {
            res.status(201).json({
                success: false,
                message: "failed",
                result: ''
            })
        }
    } catch (error) {
        handleError(res, error)
    }
}

module.exports = { getCopyTradeHistory }