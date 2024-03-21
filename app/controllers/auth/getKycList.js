const { matchedData } = require('express-validator')
const { handleError } = require('../../middleware/utils')
const { listInitOptions } = require('../../middleware/db/listInitOptions')

const {
    emailExists,
    sendRegistrationEmailMessage
} = require('../../middleware/emailer')
const { createItemInDb } = require('./helpers')
const Kyc = require('../../models/kyc')

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getKycList = async (req, res) => {
    try {
        // const data = await matchedData(req)
        // data.user_id = req.user._id
        const options = await listInitOptions(req)
        const response =  Kyc.find().populate('user_id')   
        let responses = await Kyc.paginate(response, options)
        if(responses.docs.length > 0 ){
            res.status(200).json({
                success: true,
                result: responses,
                message: "Kyc list found successfully"
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

module.exports = { getKycList }