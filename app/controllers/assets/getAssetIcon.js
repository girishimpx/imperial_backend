const { matchedData } = require('express-validator')
const { handleError } = require('../../middleware/utils')
const {
    emailExists,
    sendRegistrationEmailMessage
} = require('../../middleware/emailer')
const { createItemInDb } = require('./helpers')
const asseticon = require('../../models/assetIcon')

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getAssetIcon = async (req, res) => {
    try {
        // const data = await matchedData(req)
        // data.user_id = req.user._id
        const response = await asseticon.find()
        if(response.length > 0 ){
            res.status(200).json({
                success: true,
                result: response,
                message: "Data found successfully"
            })
        }else{
            res.status(400).json({
                success: false,
                result: "",
                message: "Data not found"
            })
        }
        
    } catch (error) {
        handleError(res, error)
    }
}

module.exports = { getAssetIcon }