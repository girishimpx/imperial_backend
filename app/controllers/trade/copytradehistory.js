const { matchedData } = require("express-validator");
const copytradehistorys = require("../../models/copytradehistory");
const { handleError } = require("../../middleware/utils");
const copytrade = require("../../models/trade");
const { isIDGood } = require("../../middleware/utils/isIDGood");
const {  listInitOptions } = require("../../middleware/db/listInitOptions");

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const CopyTradeHistory = async (req, res) => {
  try {
    const user = req.user;
let tradeList


const options = await listInitOptions(req)
if(user.trader_type == 'user'){
    let resposne = copytradehistorys.find({ user_id:user._id }).sort({ createdAt: "desc" });
         tradeList = await copytradehistorys.paginate(resposne, options)
}else{
    let responsed = copytrade.find({ user_id:user._id }).sort({ createdAt: "desc" });
    tradeList = await copytrade.paginate(responsed, options)
}
   
    if (tradeList.docs.length > 0) {
      res.status(200).json({
        success: true,
        result: tradeList,
        message: "Data Found Successfully",
      });
    } else {
      res.status(200).json({
        success: false,
        result: "",
        message: "Data Not Found",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};
module.exports = { CopyTradeHistory };
