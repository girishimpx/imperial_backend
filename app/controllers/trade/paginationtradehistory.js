const { matchedData } = require("express-validator");
const User = require("../../models/user");
const trade = require("../../models/trade");
const { handleError } = require("../../middleware/utils");
const { isIDGood } = require("../../middleware/utils/isIDGood");
const {  listInitOptions } = require("../../middleware/db/listInitOptions");
/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const PaginateTradeHistory = async (req, res) => {
  try {
    const options = await listInitOptions(req)
    const user = req.user;
    // let tradeList = await trade.paginate({ user_id: user._id },options);
    let tradeList = await trade.find({ user_id: user._id }).sort({createdAt : -1});

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
module.exports = { PaginateTradeHistory };
