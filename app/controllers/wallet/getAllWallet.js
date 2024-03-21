const { getItems } = require('../../middleware/db/getItems')
const wallet = require('../../models/wallet')
const { handleError } = require('../../middleware/utils')

const getAllWallet = async (req, res) => {
    try {
        const data = await wallet.find()
        if (data.length > 0 ) {
            res.status(200).json({
                success: true,
                result: data,
                message: 'Wallet found succesfully'
            })

        } else {
            res.status(400).json({
                success: false,
                result: null,
                message: 'Wallet not found'
              })

        }

    } catch (error) {
        handleError(res, error)
    }
}
module.exports = { getAllWallet }