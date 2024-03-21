const { handleError } = require('../../middleware/utils')
const { getAllTradePairFromDB } = require('./helpers')

/**
 * Get all items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getAllAssetPair = async (req, res) => {
    try {
        const response = await getAllTradePairFromDB()
        res.status(200).json({
            success: true,
            result: response,
            message: "Data found successfully"
        })
    } catch (error) {
        handleError(res, error)
    }
}

module.exports = { getAllAssetPair }
