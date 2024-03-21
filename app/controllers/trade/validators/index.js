const { validateCreateTrade } = require("./validateCreateTrade");
const { validateUserID } = require("./validateUserId");
const { validateCancelTrade } = require("./ValidateCancelTrade");
const { validateCreateSubscription } = require("./validateCreateSubscription");
const { validateAdminTradeList } = require("./validateAdminTradeList");

const { ValidateBUySellinAdmin } = require("./validateAdminpageBuySell");
const { ValidateAdminpending } = require("./validateAdminpagePendingcopy");
const { validateAddSubscribe } = require("./validateAddSubscription");
const { validateEditSubscribe } = require("./ValidateEdittradeDetail");
const { validateTradeByPAir } = require("./validate_trade_history_by_pair");
const {validateDisableSubscribe} = require("./validateDisableSubscribe")
const { validateUserTradeHistory } = require('./validateUserTradeHistory')
const { VAlidate_open_order_history_for_future  } = require('./validate_open_order_history_for_future')
const { Validate_copy_trade_status  } = require('./validatecopytradestatuschange')



module.exports = {
  validateCreateTrade,
  ValidateAdminpending,
  Validate_copy_trade_status,
  validateTradeByPAir,
  validateEditSubscribe,
  validateDisableSubscribe,
  validateUserID,
  validateCancelTrade,VAlidate_open_order_history_for_future,
  validateCreateSubscription,
  validateAdminTradeList,
  validateAddSubscribe,
  ValidateBUySellinAdmin,
  validateUserTradeHistory
};
