const { createTrade } = require("./createTrade");
const { TradeHistory } = require("./tradehistory");
const { Cancel_Trade } = require("./cancel_trade");
const { createsubscription } = require("./CreateSubscription");
const { admintradelist } = require("./adminTradeList");

const { CopyTradeHistory } = require("./copytradehistory");
const { mySubscriptionList } = require("./getMySubcription");
const { Adminbuysell } = require("./AdminBuysellhistory");
const { AdminPendingList } = require("./AdminPendingHistory ");
const { AddSubscriber } = require("./addfollowers");
const { EditSubscribeDetail } = require("./EditsubscribeDetail");
const { userTrade } = require("./usertrade")
const { PaginateTradeHistory } = require("./paginationtradehistory")
const { PaginateCopyTradeHistory } = require("./paginatecopytradehistory")
const { StatergyHistory } = require("./StatergyHistory")
const { getPositionHistory } = require('./getPositionHistory')
const { getUserTradingHistory } = require('./getUserTradingHistory')
const { Ordre_history_for_future } = require('./ordre_histioy_for_future')
const { FollowerCount } = require('./followercount')
const { lastTradeHistory } = require('./last_trade_history')
const { CheckTradeDetail } = require('./CopytradeExistCheck')
const { Total_tradeList_of_an_user } = require('./Total_tradelist_of_an_user')
const { Copy_trade_start } = require('./copytrade_status_change')
const { disableSubscription } = require('./disableSubscription')
const { createsubaccount } = require('./createsubaccount')


module.exports = {
  createTrade,
  TradeHistory,
  Copy_trade_start,
  Ordre_history_for_future,
  PaginateTradeHistory,
  Total_tradeList_of_an_user,
  PaginateCopyTradeHistory,
  Adminbuysell,
  AddSubscriber,
  EditSubscribeDetail,
  AdminPendingList,
  Cancel_Trade,
  CheckTradeDetail,
  createsubscription,
  admintradelist,
  CopyTradeHistory,
  mySubscriptionList,
  userTrade,
  getPositionHistory,
  getUserTradingHistory,
  FollowerCount,
  StatergyHistory,
  lastTradeHistory,
  disableSubscription,
  createsubaccount
};
