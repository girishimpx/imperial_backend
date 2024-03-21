const trade = require("../../models/copytrade");
const disableTrade = require("../../models/disabletrade")
const { createItem } = require("../../middleware/db");
const { handleError } = require("../../middleware/utils");
const { matchedData } = require("express-validator");
const { encrypt } = require("../../middleware/auth/encrypt");


/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const mySubscriptionList = async (req, res) => {
  try {
    const user = req.user;

    const enable = await trade.find({ user_id: user._id })
const enableLength = enable.length;
    const disable = await disableTrade.find({ user_id: user._id })
    const disableLength = disable.length;
    const Subscription = enable.concat(disable);
    Array.prototype.sortBy = function(p) {
      return this.slice(0).sort(function(a,b) {
        return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
      });
    }
    const mySubscription = Subscription.sortBy("exchange")
    if (mySubscription.length > 0) {
      res.status(200).json({
        success: true,
        result: mySubscription,enableLength,disableLength,
        message: "Data Found successfully",
      });
    } else {
      res.status(200).json({
        success: false,
        result: "",
        message: "Data Not Found ",
      });
    } 
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { mySubscriptionList };
