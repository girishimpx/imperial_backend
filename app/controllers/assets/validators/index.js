const { validateCreateAsset } = require("./validateCreateAsset")
const { validateUpdateAsset } = require("./validateUpdateAsset")
const { validateGetAsset } = require("./validateGetAsset")
const { validateAssetSymbol } = require("./validateAssetSymbol")
const{ validateinsertTradePair }= require("./validateInsertTradePair")
const{ validateGetAssetPairbyId }= require("./validateGetAssetPairbyId")
const{ validateGetAssetByTradepair }= require("./validateGetAssetPairBySymbol")


module.exports = {
    validateCreateAsset,
    validateUpdateAsset,
    validateGetAsset,
    validateAssetSymbol,
    validateinsertTradePair,
    validateGetAssetPairbyId,
    validateGetAssetByTradepair
}
