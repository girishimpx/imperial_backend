
const Model = require('../../models/notification')
const { updateItem } = require('../../middleware/db')
const { isIDGood, handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const { assetExistsExcludingItself } = require('../assets/helpers/assetExistsExcludingItself')

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getMyNOtification = async (req, res) => {
    try {

      const user  = req.user
      req = matchedData(req)
      const notification = await Model.find({user_id: user._id,checked:false})
if(notification.length > 0 ){
  res.status(200).json({
    success: true,
    result: notification,
    message: "You have some Notification"
})

} else{
  res.status(400).json({
    success: false,
    result: null,
    message: "Notification Not Exist"
})
}     
        

    } catch (error) {
      handleError(res, error)
    }
  }
  
  module.exports = { getMyNOtification }