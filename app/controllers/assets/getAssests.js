const Assets = require('../../models/assets')
const { checkQueryString, getItems } = require('../../middleware/db')
const { handleError } = require('../../middleware/utils')

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getAssets = async (req, res) => {
  try {
    const query = await checkQueryString(req.query)
    const response = await getItems(req, Assets, query)
    res.status(200).json({
      success: true,
      result: { ...response },
      message: ""
    })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getAssets }