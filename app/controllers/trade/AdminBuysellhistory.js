const { matchedData } = require("express-validator");
const copytradehistorys = require("../../models/copytradehistory");
const { handleError } = require("../../middleware/utils");
const { listInitOptions } = require("../../middleware/db/listInitOptions");
const trade = require("../../models/trade");
const { isIDGood } = require("../../middleware/utils/isIDGood");


/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const Adminbuysell = async (req, res) => {
  try {
    const user = req.user;
    const options = await listInitOptions(req)
    req = matchedData(req)

const filterData =  trade.find({order_type:req.order_type,pair:req.pair,trade_type:req.trade_type,status:{$ne:"init"}}).populate("user_id")
let responses = await trade.paginate(filterData, options)
if(responses.docs.length > 0 ){
    res.status(200).json({
        success: true,
        result: responses,
        message:"Data found Successfully" ,
      });
}else{
  // console.log("error")
    res.status(400).json({
        success: false,
        result: "",
        message: "Data not found",
      });
}




  } catch (error) {
    handleError(res, error);
  }
};
module.exports = { Adminbuysell };
