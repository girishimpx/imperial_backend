const { matchedData } = require("express-validator");
const trade = require("../../models/trade");
const { handleError } = require("../../middleware/utils");

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const admintradelist = async (req, res) => {
  try {
    req = matchedData(req)
    let tradeList 
    if(req.findquery == 'buy'){
        tradeList = await trade.find({trade_type:req.findquery})
    }else if(req.findquery == 'sell'){
        tradeList = await trade.find({trade_type:req.findquery})
    }else if(req.findquery == 'init'){
        tradeList = await trade.find({status:req.findquery})
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
module.exports = { admintradelist };
