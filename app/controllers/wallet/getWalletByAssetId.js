const { getItemById } = require('../../middleware/db')
const wallet = require('../../models/wallet')
const { handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')

const getWalletByAssetId = async (req, res) => {
    try {
        const user = req.user
        req = matchedData(req)
        const data = await wallet.find({user_id:user._id,asset_id:req.asset_id})
        if (data.length > 0) {
            res.status(200).json({
                success: true,
                result: data,
                message: 'Data found succesfully'
            })

        } else {
            res.status(400).json({
                success: false,
                result: null,
                message: 'Data not found'
              })

        }

    } catch (error) {
        handleError(res, error)
    }
}
module.exports = { getWalletByAssetId }