const { matchedData } = require("express-validator");
const copytrade = require("../../models/copytrade");
const { handleError } = require("../../middleware/utils");




/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const Copy_trade_start= async (req, res) => {
  try {
    const user = req.user;
    req = matchedData(req)
  

copytrade.findOneAndUpdate({user_id:user._id,exchange:req.exchange},{status:req.status},(err,done)=>{
  if(err){
res.status(400).json({
  success: false,
  result: "",
  message: "Status not changed",
});
  }else{
res.status(200).json({
  success: !false,
  result: "",
  message: `${req.exchange} has been ${req.status == true ? "Enabled":"Disabled" }`,
});
  }
})





  } catch (error) {
    handleError(res, error);
  }
};
module.exports = { Copy_trade_start };
