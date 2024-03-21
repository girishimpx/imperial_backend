const { matchedData } = require('express-validator')
const Assets = require('../../models/assets')
const { getItem } = require('../../middleware/db/getItem')
const { isIDGood, handleError } = require('../../middleware/utils')

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getAssetBySymbol = async (req, res) => {
  try {
    req = matchedData(req)
    const asset = req.symbol
    let query = {};
    query.symbol = asset;
    const response = await getItem(query, Assets)
    res.status(200).json({
        success: true,
        result: response,
        message: "Data found successfully"
      })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getAssetBySymbol }
