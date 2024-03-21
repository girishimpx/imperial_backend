const { matchedData } = require('express-validator')
const Assets = require('../../models/assets')
const { getItemById } = require('../../middleware/db')
const { isIDGood, handleError } = require('../../middleware/utils')

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getAsset = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await isIDGood(req.id)
    const response = await getItemById(id, Assets)
    res.status(200).json({
        success: true,
        result: response,
        message: ""
      })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getAsset }
