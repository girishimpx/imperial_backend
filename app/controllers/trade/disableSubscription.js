const trade = require("../../models/copytrade");
const DisableTrade = require("../../models/disabletrade")
const { createItem } = require("../../middleware/db");
const { handleError } = require("../../middleware/utils");
const { matchedData } = require("express-validator");
const { encrypt } = require("../../middleware/auth/encrypt");
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const disableSubscription = async (req, res) => {
  try {
    const user = req.user;
    // req = matchedData(req);
       console.log(req.body.status)
       if(req.body.status === "disable"){
        const isExist = await trade.findOne({
          user_id: user._id,
          exchange: req.body.exchange,
    _id:req.body._id
        });
        if (isExist) {
          console.log(req.body.exchange)
          console.log(isExist)
          
          const data = {
            user_id: user._id,
            apikey: isExist.apikey,
            secretkey: isExist.secretkey,
            api_name: isExist.api_name,
            permission: isExist.permission,
            exchange: isExist.exchange,
            passphrase: isExist.passphrase,
            follower_user_id: isExist.followerdata,
            trade_base:{
              spot:isExist.spot,
              margin:isExist.margin,
              future:isExist.future
            },
          };
    
          
    
          const createSub = await DisableTrade.create(data);
          await trade.deleteOne({
            user_id: user._id,
            exchange: req.body.exchange,
      _id:req.body._id
          });
          res.status(200).json({
            success: true,
            result: isExist,
            message: "Subscription disabled Successfully",
          });
        } else {
          res.status(200).json({
            success: false,
            result: "",
            message: "Data Not Found",
          });
        }
       }else if(req.body.status === "enable"){
        const isExist = await DisableTrade.findOne({
          user_id: user._id,
          exchange: req.body.exchange,
    _id:req.body._id
        });
        if (isExist) {
          console.log(req.body.exchange)
          console.log(isExist)
          
          const data = {
            user_id: user._id,
            apikey: isExist.apikey,
            secretkey: isExist.secretkey,
            api_name: isExist.api_name,
            permission: isExist.permission,
            exchange: isExist.exchange,
            passphrase: isExist.passphrase,
            follower_user_id: isExist.followerdata,
            trade_base:{
              spot:isExist.spot,
              margin:isExist.margin,
              future:isExist.future
            },
          };
    
          console.log(data,"data")
    
          const createSub = await trade.create(data);
          await DisableTrade.deleteOne({
            user_id: user._id,
            exchange: req.body.exchange,
      _id:req.body._id
          });
          res.status(200).json({
            success: true,
            result: isExist,
            message: "Subscription Enabled Successfully",
          });
        } else {
          res.status(200).json({
            success: false,
            result: "",
            message: "Data Not Found",
          });
        }
       }
    
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { disableSubscription };
