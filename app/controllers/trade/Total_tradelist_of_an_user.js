const { matchedData } = require("express-validator");
const User = require("../../models/user");
const trade = require("../../models/trade");
const { handleError } = require("../../middleware/utils");
const mongoose = require("mongoose");
const {
  imperialApiAxios,
} = require("../../middleware/ImperialApi/imperialApi");

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const Total_tradeList_of_an_user = async (req, res) => {
  try {
    const user = req.user;
    req = matchedData(req);
    const idverify = mongoose.Types.ObjectId.isValid(req.id);

    let list = {
      //   "BTC-XRP":[{a:0},{a:0}]
    };

    if (idverify) {
      const tradeList = await trade.find({ user_id: req.id });
      if (tradeList.length > 0) {
        for (let i = 0; i < tradeList.length; i++) {


          if (list[tradeList[i].pair]) {
            if (
              tradeList[i].trade_at == "spot" ||
              tradeList[i].trade_at == "Spot"
            ) {
              list[tradeList[i].pair].spot.push(tradeList[i]);
            } else if (
              tradeList[i].trade_at == "Margin" ||
              tradeList[i].trade_at == "margin"
            ) {
              list[tradeList[i].pair].margin.push(tradeList[i]);
            } else if (
              tradeList[i].trade_at == "future" ||
              tradeList[i].trade_at == "Future"
            ) {
              list[tradeList[i].pair].future.push(tradeList[i]);
            }


          } else {
            let app = {
              spot: [],
              margin: [],
              future: [],
            };

            if (
              tradeList[i].trade_at == "spot" ||
              tradeList[i].trade_at == "Spot"
            ) {
              app.spot.push(tradeList[i]);
            } else if (
              tradeList[i].trade_at == "Margin" ||
              tradeList[i].trade_at == "margin"
            ) {
              app.margin.push(tradeList[i]);
            } else if (
              tradeList[i].trade_at == "future" ||
              tradeList[i].trade_at == "Future"
            ) {
              app.future.push(tradeList[i]);
            }

            list[tradeList[i].pair] = app;
          }
        }
        res.status(200).json({
          success: true,
          result: list,
          message: "Data Found Successfully",
        });
      } else {
        res.status(400).json({
          success: false,
          result: null,
          message: "This master did not trade yet",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        result: null,
        message: "Id malformed",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};
module.exports = { Total_tradeList_of_an_user };
