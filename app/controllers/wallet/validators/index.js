const { validatecreateWallet } = require('./validateCreateWallet')
const { validateGetWalletByAssetId } = require('./validateGetWalletByAssetId')
const { validateUpdateWallet }= require('./validateUpdateWallet')


module.exports = {
    validatecreateWallet,
    validateGetWalletByAssetId,
    validateUpdateWallet
}