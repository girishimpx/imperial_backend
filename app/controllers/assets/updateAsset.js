const Asset = require('../../models/assets')
const { updateItem } = require('../../middleware/db')
const { isIDGood, handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const { assetExistsExcludingItself } = require('./helpers/assetExistsExcludingItself')

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateAsset = async (req, res) => {
    try {
        req = matchedData(req)
        const id = await isIDGood(req.id)
        const doesAssetExists = await assetExistsExcludingItself(id, req.source)
        if (!doesAssetExists) {
          const response = await updateItem(id, Asset, req)
          res.status(200).json({
            success : true,
            result:  response,
            message: "Updated Successfully!"
          })
        }
    } catch (error) {
      handleError(res, error)
    }
  }
  
  module.exports = { updateAsset }