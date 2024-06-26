const { addAssets } = require('./addAssets')
const { createSubAcc } = require('./createSubAcc')
const { createDepositAddress } = require('./createDepositAddress')
const { depositHIstory } = require('./depositHIstory')
const { listCoins } = require('./listCoins')
const { addressForAAsset } = require('./addressForAAsset')
const { createWallet } = require('./createWallet')
const { getWalletById } = require('./getWalletById')
const { updateBalanceForAllUser } = require('./updateBalanceForAllUser')
const { allTickers } = require('./allTickers')
const { orderbookdetailes } = require('./orderbookdetailes')
const { bybitUserTrade } = require('./bybitUserTrade')
const { getSubAccInfo } = require('./getSubAccInfo')
const { getOpenOrders } = require('./getOpenOrders')
const { cancelOrder } = require('./cancelOrder')
const { getTradeDetails } = require('./getTradeDetails')
const { getPairsByCategory } = require('./getPairsByCategory')
const { getPairsbyType } = require('./getPairsbyType')
const { getInstrumentInfo } = require('./getInstrumentInfo')
const { modifySubApi } = require('./modifySubApi')
const { getTradeBalance } = require('./getTradeBalance')
const { getcpyData } = require('./getcpyData')
const { getPositionList } = require('./getPositionList')
const { closePosition } = require('./closePosition')
const { getPositionClose } = require('./getPositionClose')
const { deleteDuplicateRecords } = require('./deleteDuplicateRecords')


const { addDemoFund } = require('./addDemoFund')
const { setCollatralCoin } = require('./setCollatralCoin')
const { masterTrade } = require('./masterTrade')
const { balance } = require('./balance')
const { createInternalTransfer } = require('./createInternalTransfer')
const { updateAllUserFundBalance } = require('./updateAllUserFundBalance')
const { updateWalletBalanceSDK } = require('./updateWalletBalanceSDK')


module.exports = {
     addAssets,
     createSubAcc,
     createDepositAddress,
     depositHIstory,
     listCoins,
     addressForAAsset,
     createWallet,
     getWalletById,
     updateBalanceForAllUser,
     allTickers,
     orderbookdetailes,
     bybitUserTrade,
     getSubAccInfo,
     getOpenOrders,
     cancelOrder,
     addDemoFund,
     setCollatralCoin,
     masterTrade,
     balance,
     getTradeDetails,
     getPairsByCategory,
     getPairsbyType,
     createInternalTransfer,
     updateAllUserFundBalance,
     getInstrumentInfo,
     modifySubApi,
     getTradeBalance,
     getcpyData,
     getPositionList,
     closePosition,
     getPositionClose,
     updateWalletBalanceSDK,
     deleteDuplicateRecords
}