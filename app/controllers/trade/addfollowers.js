const trade = require("../../models/copytrade");
const { createItem } = require("../../middleware/db");
const { handleError, isIDGood } = require("../../middleware/utils");
const { matchedData } = require("express-validator");
const { encrypt } = require("../../middleware/auth/encrypt");
const mongoose = require("mongoose");

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const AddSubscriber = async (req, res) => {
  try {
    const user = req.user;
    req = matchedData(req);
    const goodID = mongoose.Types.ObjectId.isValid(req.follower_id);
console.log(user._id,"--id--")

// const add = await trade.find({"follower_user_id.follower_id":req.follower_id})
// res.send(add)

    if (goodID) {
      const MyData = await trade.find({ user_id: user._id });
    
      if (MyData.length > 0) {

        for(let j = 0; j < MyData[0].follower_user_id.length; j++) {
          if(MyData[0].follower_user_id[j].follower_id == req.follower_id){
            return res.status(200).json({
              success: false,
              result: "",
              message: "You have already subscribed this follower",
            });  
          }
        }


        let errors = [];
        let times = 0;
        for (let i = 0; i < MyData.length; i++) {
          await trade.findByIdAndUpdate(
            { _id: MyData[i]._id },
            {
              $addToSet: {
                follower_user_id: [
                  {
                    follower_id: req.follower_id,
                    amount: req.amount,
                  },
                ],
              },
            },
            async (err, done) => {
              if (done) {
                times = times + 1;
              }
              if (err) {
                console.log(err, "err");
                errors.push({
                  exchange: MyData[i].exchange,
                  message: "follower did not updated",
                });
              }
            }
          );
        }
        if (errors.length > 0) {
          res.status(200).json({
            success: false,
            result: errors,
            message: "follower did not updated to some exchange",
          });
        } else {
          res.status(200).json({
            success: true,
            result: "",
            message: "follower added successfully",
          });
        }
      } else {
        res.status(400).json({
          success: false,
          result: "",
          message: "Data Not Founds",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        result: "",
        message: "Id malformed",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { AddSubscriber };
