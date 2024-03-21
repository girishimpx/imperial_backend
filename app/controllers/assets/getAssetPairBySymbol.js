const { matchedData } = require('express-validator')
const tradepair = require('../../models/tradePairs')
const { getItemTrade } = require('../../middleware/db/getItemTrade')
const { handleError } = require('../../middleware/utils')

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getAssetBytradepair = async (req, res) => {
  try {
    req = matchedData(req)
  
    const asset = req.tradepair
    let query = {};
    query.tradepair = req.tradepair;
    const response = await getItem(query, tradepair)
    res.status(200).json({
        success: true,
        result: response,
        message: "Data found successfully"
      })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getAssetBytradepair }
