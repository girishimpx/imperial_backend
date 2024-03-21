const { matchedData } = require("express-validator");
const copytrade = require("../../models/copytrade");
const { handleError } = require("../../middleware/utils");




/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const CheckTradeDetail= async (req, res) => {
  try {
    const user = req.user;
    req = matchedData(req)
const filterData = await copytrade.find({user_id:user._id})
if(filterData.length > 0 ){
    res.status(200).json({
        success: true,
        result: true,
        message:"user has given trade details" ,
      });
}else{
  
    res.status(400).json({
        success: false,
        result: "",
        message: "User has not given trade details",
      });
}


  } catch (error) {
    handleError(res, error);
  }
};
module.exports = { CheckTradeDetail };
