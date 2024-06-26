const { createAsset } = require('./createAsset')
const { updateAsset } = require('./updateAsset')
const { getAllAssets } = require('./getAllAssets')
const { getAssets } = require('./getAssests')
const { getAsset } = require('./getAsset')
const { getAssetBySymbol } = require('./getAssetBySymbol')
const { insertTradepair } = require('./insertTradePair')
const { getAllAssetPair } = require('./getAllAssetPair')
const { getAssetPairbyId } = require('./getAssetPairById')
const { getAssetBytradepair } = require('./getAssetPairBySymbol')
const { getFutureAssets } = require('./getFutureAssets')
const { allTickers } = require('./allTickersCron')
const { get_Future_pairs } = require('./get_future_pairs')
const { marketPairs } = require('./marketPairs')
const { createasseticon } = require('./createAssetIcon')
const { getAssetIcon } = require('./getAssetIcon')
const { marketPairsbyName } = require('./marketPairsbyName')
const { marketPairsAuth } = require('./marketPairsAuth')
const { addFavPairs } = require('./addFavPairs')
const { addFavPairsFuture } = require('./addFavPairsFuture')
const { add_extra_asset } = require('./add_extra_asset')




module.exports = {
    createAsset,
    updateAsset,
    getAllAssets,
    marketPairsbyName,
    get_Future_pairs,
    getAssets,
    getAsset,
    getAssetBySymbol,
    insertTradepair,
    getAllAssetPair,
    getAssetPairbyId,
    getAssetBytradepair,
    getFutureAssets,
    allTickers,
    marketPairs,
    createasseticon,
    getAssetIcon,
    marketPairsAuth,
    addFavPairs,
    addFavPairsFuture,
    add_extra_asset,
}
