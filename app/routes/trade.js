const express = require("express");
const router = express.Router();
require("../../config/passport");
const passport = require("passport");
const requireAuth = passport.authenticate("jwt", {
  session: false,
});
const trimRequest = require("trim-request");
const { roleAuthorization } = require("../controllers/auth");
const {
  createTrade,
  TradeHistory,
  Cancel_Trade,
  createsubscription,
  CopyTradeHistory,
  mySubscriptionList,
  Adminbuysell,
  AdminPendingList,
  AddSubscriber,
  EditSubscribeDetail,
  StatergyHistory,
  PaginateTradeHistory,
  PaginateCopyTradeHistory,
  admintradelist,
  userTrade,
  getPositionHistory,
  getUserTradingHistory,
  disableSubscription,
  Ordre_history_for_future,
  FollowerCount,
  lastTradeHistory,
  CheckTradeDetail,
  Total_tradeList_of_an_user,
  Copy_trade_start,
  createsubaccount,
  FutureTradeHistory
} = require("../controllers/trade/index");
const {
  validateCreateTrade,
  validateUserID,
  validateCancelTrade,
  validateCreateSubscription,
  ValidateBUySellinAdmin,
  ValidateAdminpending,
  validateAddSubscribe,
  validateEditSubscribe,
  validateDisableSubscribe,
  validateAdminTradeList,
  validateTradeByPAir,
  validateUserTradeHistory,
  VAlidate_open_order_history_for_future,
  Validate_copy_trade_status,

} = require("../controllers/trade/validators/index");

/*Admin panel buy sell side*/
router.post(
  "/buysellhistory",
  requireAuth,
  roleAuthorization(["admin"]),
  trimRequest.all,
  ValidateBUySellinAdmin,
  Adminbuysell
);

/*Copy trade exchange status change api*/
router.post(
  "/account_status",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  Validate_copy_trade_status,
  Copy_trade_start
);

/*Admin panel pendinglist side*/
router.post(
  "/pendinghistory",
  requireAuth,
  roleAuthorization(["admin"]),
  trimRequest.all,
  ValidateAdminpending,
  AdminPendingList
);
router.post(
  "/positionHistory",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  getPositionHistory
);

router.post(
  "/userTradeHistory",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  validateUserTradeHistory,
  getUserTradingHistory
);

/*Trade List of a given master*/
router.post(
  "/MasterAllTradeList",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  validateUserID,
  Total_tradeList_of_an_user
);
/*add subscriber*/
router.post(
  "/addsubscriber",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  validateAddSubscribe,
  AddSubscriber
);

/*Last trade history*/
router.get(
  "/last_trade_history",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  lastTradeHistory
);
/*Check Trade Detail*/
router.get(
  "/checkTradeDetail",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  CheckTradeDetail
);

/*create trade*/
router.post(
  "/CreateTrade",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  validateCreateTrade,
  createTrade
);

/*create usertrade*/
router.post(
  "/userTrade",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  validateCreateTrade,
  userTrade
);

/*create subaccount*/
router.post(
  "/createsubaccount",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  createsubaccount
);

/*Edit subscripe detail */
router.post(
  "/editsubscribeDetail",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  validateEditSubscribe,
  EditSubscribeDetail
);

router.post(
  "/disable-subscription",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  validateDisableSubscribe,
  disableSubscription
);

// router.get(
//   "/get_disable_subscription",
//   requireAuth,
//   roleAuthorization(["user"]),
//   trimRequest.all,
//   myDisableubscriptionList
// );

/*
User Trade History
*/

router.post(
  "/tradeHistory",
  requireAuth,
  roleAuthorization(["user"]),
  validateTradeByPAir,
  trimRequest.all,
  TradeHistory
);

/*
paginate User Trade History
*/

router.get(
  "/tradeHistorypaginate",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  PaginateTradeHistory
);

/*
paginate copy Trade History
*/

router.get(
  "/copytradeHistorypaginate",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  PaginateCopyTradeHistory
);

/*
My subscription list
*/

router.get(
  "/getMysubscription",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  mySubscriptionList
);

router.get(
  "/getCopyTradeHistory",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  CopyTradeHistory
);

/*get loss or profit*/

router.get(
  "/statergieshistory",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  StatergyHistory
);

/*Order history for future*/
router.post(
  "/openorderhistoryfuture",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  VAlidate_open_order_history_for_future,
  Ordre_history_for_future
);

/*Follower count*/
router.post(
  "/followerCount",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  validateUserID,
  FollowerCount
);

/* User Trade History */

router.post(
  "/cancelTrade",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  validateCancelTrade,
  Cancel_Trade
);

router.post(
  "/createSubscription",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  validateCreateSubscription,
  createsubscription
);

router.post(
  "/adminTradeList",
  requireAuth,
  roleAuthorization(["admin"]),
  trimRequest.all,
  validateAdminTradeList,
  admintradelist
);

router.post(
  '/futureTradeHistory',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  FutureTradeHistory
)

module.exports = router;
