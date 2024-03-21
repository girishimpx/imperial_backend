const trade = require("../../models/copytrade");
const User = require("../../models/user");
const { handleError } = require("../../middleware/utils");
const { matchedData } = require("express-validator");
const { encrypt } = require("../../middleware/auth/encrypt");
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const createsubscription = async (req, res) => {
  try {
    const user = req.user;
    req = matchedData(req);
    console.log("users")
    const isExist = await trade.find({
      user_id: user._id,
      exchange: req.exchange,
    });
    if (isExist.length > 0) {
      res.status(200).json({
        success: false,
        result: "",
        message: "Already you have added this exchange ",
      });
    } else {
      const fonddata = await trade.find({ user_id: user._id });
      const findTozGetFollower = [fonddata[0]];
      

      if (findTozGetFollower.length > 0 && findTozGetFollower[0] ) {
        let followerdata;

        for (let i = 0; i < findTozGetFollower.length; i++) {
          // console.log(findTozGetFollower[i].follower_user_id,'open')
          
          followerdata = findTozGetFollower[i].follower_user_id;
        }


        
        const data = {
          user_id: user._id,
          apikey: req.apikey,
          secretkey: req.secretkey,
          api_name: req.api_name,
          permission: req.permission,
          exchange: req.exchange,
          passphrase: req.passphrase,
          follower_user_id: followerdata,
          trade_base:{
            spot:req.spot,
            margin:req.margin,
            future:req.future
          },
        };

        

        const createSub = await trade.create(data);
        console.log("users.....")
        const users = await User.findOneAndUpdate({_id:user._id},{ issubscribed: "true"})
        
        if (createSub) {
          res.status(200).json({
            success: true,
            result: createSub,
            message: "Subscribed successfully",
          });
        } else {
          res.status(200).json({
            success: false,
            result: "",
            message: "Not Subscribed ",
          });
        }
      } else {
        const data = {
          user_id: user._id,
          apikey: req.apikey,
          secretkey: req.secretkey,
          api_name: req.api_name,
          permission: req.permission,
          exchange: req.exchange,
          passphrase: req.passphrase,
          trade_base:{
            spot:req.spot,
            margin:req.margin,
            future:req.future
          },
        };

        
        const createSub = await trade.create(data);
        
        const users = await User.findOneAndUpdate({_id:user._id},{ issubscribed: "true"})
        if (createSub) {
          res.status(200).json({
            success: true,
            result: "",
            message: "Subscribed successfully",
          });
        } else {
          res.status(200).json({
            success: false,
            result: "",
            message: "Not Subscribed ",
          });
        }
      }
    }
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { createsubscription };
