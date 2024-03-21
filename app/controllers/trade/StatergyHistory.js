const { matchedData } = require("express-validator");
const User = require("../../models/user");
const trade = require("../../models/trade");
const { handleError } = require("../../middleware/utils");
const { isIDGood } = require("../../middleware/utils/isIDGood");
const tradePairs = require("../../models/tradePairs");

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const StatergyHistory = async (req, res) => {
  try {
    const user = req.user;
    let tradeList
   let StatergyList = []
    //find master Trater
        let masterTrader = await User.findById(user._id)
        console.log("masterTrader",masterTrader.trader_type)
if (masterTrader.trader_type === "master"){
    tradeList = await trade.find({ user_id: user._id }).sort({ createAt: -1 });
    for (i=0;i<tradeList.length;i++){
        console.log(tradeList[i].pair,"  ",tradeList[i].entry_price,"  ",tradeList[i].exit_price)
        let Profit = tradeList[i].exit_price - tradeList[i].entry_price
       
    if(Profit < 0){
        data = {
            trade_pair : tradeList[i].pair,
            trade_pair : tradeList[i].pair,
            entry_price : tradeList[i].entry_price,
            exit_price : tradeList[i].exit_price,
            difference : tradeList[i].exit_price - tradeList[i].entry_price,
            profit_history: "Loss"
        }
    }
    if(Profit > 0){
        data = {
            trade_pair : tradeList[i].pair,
            entry_price : tradeList[i].entry_price,
            exit_price : tradeList[i].exit_price,
            difference : tradeList[i].exit_price - tradeList[i].entry_price,
            profit_history: "Gain"
        }
    }
    
        StatergyList.push(data)
        console.log(StatergyList.length)
    }

    //const average = (StatergyList[0].difference + StatergyList[StatergyList.length-1].difference) / StatergyList.length
  
    if (StatergyList.length > 0) {
      res.status(200).json({
        success: true,
        result: StatergyList,
        message: "Data Found Successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        result: "",
        message: "Data Not Found",
      });
    }
}
else {
    res.status(400).json({
      success: false,
      result: "",
      message: "Trader type is not a Master",
    });
  }
  } catch (error) {
    handleError(res, error);
  }
};
module.exports = { StatergyHistory };
