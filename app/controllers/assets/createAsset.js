const Asset = require('../../models/assets')
const { createItem } = require('../../middleware/db')
const { handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const { assetExists } = require('./helpers/assetExists')

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createAsset = async (req, res) => {
    try {
      req = matchedData(req)
      const doesAssetExists = await assetExists(req.symbol)
      if (!doesAssetExists) {
        const response = await createItem(req, Asset)

        res.status(201).json({
            success : true,
            result:  response,
            message: 'Asset created successfully'
          })
      }
    } catch (error) {
      handleError(res, error)
    }
  }

  module.exports = { createAsset }
