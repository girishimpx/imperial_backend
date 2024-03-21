const { handleError } = require('../../middleware/utils')
const { getAllAssetsItemsFromDB } = require('./helpers')

/**
 * Get all items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getAllAssets = async (req, res) => {
    try {
        const response = await getAllAssetsItemsFromDB()
        res.status(200).json({
            success: true,
            result: response,
            message: "Data found successfully"
        })
    } catch (error) {
        handleError(res, error)
    }
}

module.exports = { getAllAssets }
