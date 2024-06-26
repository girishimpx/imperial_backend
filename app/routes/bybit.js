const express = require("express");
const router = express.Router();
require("../../config/passport");
const passport = require("passport");
// const image  = require('../.././public/image/download.png')
const requireAuth = passport.authenticate("jwt", {
  session: false,
});
const trimRequest = require("trim-request");

const ejs = require("ejs");
const path = require("path");
const multer = require("multer");

const { roleAuthorization } = require("../controllers/auth");


const {
  addAssets,
  createSubAcc,
  createDepositAddress,
  depositHIstory,
  listCoins,
  addressForAAsset,
  createWallet,
  getWalletById,
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
  getInstrumentInfo,
  modifySubApi,
  getTradeBalance,
  getcpyData,
  getPositionList,
  closePosition,
  getPositionClose,
  updateWalletBalanceSDK,
  deleteDuplicateRecords
} = require("../controllers/byBitAPI");

const {
  validateUserTrade
} = require("../controllers/byBitAPI/validators/validateUserTrade");
const { validateGetInstrumentInfo } = require('../controllers/byBitAPI/validators/validateGetInstrumentInfo')

const { validateCreateTrade } = require("../controllers/trade/validators/index")

/*
 * Users routes
 */

router.post(
  "/getnewpairsbytype",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  getPairsbyType
);

// router.post(
//   "/deleteDuplicateRecords",
//   deleteDuplicateRecords
// );

router.post(
  "/updateWalletBalanceSDK",
  // requireAuth,
  // roleAuthorization(["user"]),
  // trimRequest.all,
  updateWalletBalanceSDK
);

router.post(
  "/getclosedposition",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  getPositionClose
);

router.post(
  "/getposition",
  // requireAuth,
  // roleAuthorization(["user"]),
  // trimRequest.all,
  getPositionList
);

router.post(
  "/closeposition",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  closePosition
);

router.get(
  "/getuserdata",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  getcpyData
);

router.post(
  "/gettradebalance",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  getTradeBalance
);

router.post(
  "/getpairdetailes",
  validateGetInstrumentInfo,
  getInstrumentInfo
);

router.post(
  "/modifysubip",
  modifySubApi
);

// router.post(
  // "/addassets",
  //   requireAuth,
  //   roleAuthorization(["user"]),
  //   trimRequest.all,
  // addAssets
// );

router.post(
  "/getbalance",
  balance
);

router.post(
  "/demofunds",
  //   requireAuth,
  //   roleAuthorization(["user"]),
  //   trimRequest.all,
  addDemoFund
);

router.post(
  "/createsub",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  createSubAcc
);

router.post(
  "/createdepoAdd",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  createDepositAddress
);

router.post(
  "/depohistory",
  // requireAuth,
  // roleAuthorization(["user"]),
  // trimRequest.all,
  depositHIstory
);

router.post(
  "/allhistory",
  // requireAuth,
  // roleAuthorization(["user"]),
  // trimRequest.all,
  getTradeDetails
);

router.get(
  "/allcoins",
  // requireAuth,
  // roleAuthorization(["user"]),
  // trimRequest.all,
  listCoins
);

router.post(
  "/address",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  addressForAAsset
);

// router.post(
//   "/getpairsbycategory",
//   // requireAuth,
//   // roleAuthorization(["user"]),
//   trimRequest.all,
//   getPairsByCategory
// );

router.post(
  "/generatewallet",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  createWallet
);

router.get(
  "/getwallets",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  getWalletById
);

router.get(
  "/allpairs",
  // requireAuth,
  // roleAuthorization(["user"]),
  // trimRequest.all,
  allTickers
);

router.post(
  "/orderbook",
  // requireAuth,
  // roleAuthorization(["user"]),
  // trimRequest.all,
  orderbookdetailes
);

router.post(
  "/trade",
  requireAuth, roleAuthorization(["user"]),
  trimRequest.all,
  validateUserTrade,
  bybitUserTrade
);

router.post(
  "/collatralcoin",
  // requireAuth, roleAuthorization(["user"]),
  setCollatralCoin
);

router.post(
  "/info",
  getSubAccInfo
);

router.post(
  "/getopenorders",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  getOpenOrders

);

router.post(
  "/cancelorder",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  cancelOrder
);

router.post(
  "/mastertrade",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  validateCreateTrade,
  masterTrade
);

router.post(
  '/createInternalTransfer',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  createInternalTransfer
)

module.exports = router;
