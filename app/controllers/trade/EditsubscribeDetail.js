const trade = require("../../models/copytrade");
const { createItem } = require("../../middleware/db");
const { handleError } = require("../../middleware/utils");
const { matchedData } = require("express-validator");
const { encrypt } = require("../../middleware/auth/encrypt");
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const EditSubscribeDetail = async (req, res) => {
  try {
    const user = req.user;
    req = matchedData(req);
    req.trade_base = {
  spot:req.spot,
  margin:req.margin,
  future: req.future
    }


    const isExist = await trade.find({
      user_id: user._id,
      exchange: req.exchange,
    });
    if (isExist.length > 0) {
      delete req.exchange;

      const updateValue = await trade.findByIdAndUpdate(
        { _id: isExist[0]._id },
        req,
        (err, done) => {
          if (err) {
            res.status(200).json({
              success: false,
              result: "",
              message: "Details Not Updated",
            });
          }

          if (done) {
            res.status(200).json({
              success: true,
              result: "",
              message: "Details Updated successfully",
            });
          }
        }
      );
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

module.exports = { EditSubscribeDetail };
