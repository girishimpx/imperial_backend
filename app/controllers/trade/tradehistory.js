const { matchedData } = require("express-validator");
const User = require("../../models/user");
const trade = require("../../models/trade");
const { handleError } = require("../../middleware/utils");
const { isIDGood } = require("../../middleware/utils/isIDGood");

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const TradeHistory = async (req, res) => {
  try {
    const user = req.user;
    req = matchedData(req)

    let tradeList
    console.log(user._id,req?.pair,'rtyuhijouy****8');
    if (req?.pair != "All") {
      tradeList = await trade.find({ user_id: user._id, pair: req.pair }).sort({ createAt: -1 });
    } else {
      tradeList = await trade.find({ user_id: user._id }).sort({ createAt: -1 });
    }
    if (tradeList.length > 0) {
      res.status(200).json({
        success: true,
        result: tradeList,
        message: "Data Found Successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        result: "",
        message: "Data Not Found",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};
module.exports = { TradeHistory };
