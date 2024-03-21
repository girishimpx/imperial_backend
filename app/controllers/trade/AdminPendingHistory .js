const { matchedData } = require("express-validator");
const copytradehistorys = require("../../models/copytradehistory");
const { handleError } = require("../../middleware/utils");
const trade = require("../../models/trade");
const { isIDGood } = require("../../middleware/utils/isIDGood");
const {  listInitOptions } = require("../../middleware/db/listInitOptions");

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const AdminPendingList = async (req, res) => {
  try {
    const user = req.user;
    const options = await listInitOptions(req)
    req = matchedData(req)

    let filterData
    let responses 
if(req.pair == "All"){
  
  filterData =  trade.find({trade_type:req.trade_type,status:{$eq:"init"}}).populate("user_id")
  responses = await trade.paginate(filterData, options)
}else{
  filterData =  trade.find({pair:req.pair,trade_type:req.trade_type,status:{$eq:"init"}}).populate("user_id")  
  responses = await trade.paginate(filterData, options)
}


if(responses.docs.length > 0 ){
    res.status(200).json({
        success: true,
        result: filterData,
        message:"Data found Successfully" ,
      });
}else{
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
module.exports = { AdminPendingList };
