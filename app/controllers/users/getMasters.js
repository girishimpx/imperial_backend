const User = require("../../models/user");
const Trade = require("../../models/trade");
const { matchedData } = require("express-validator");
const CopyTrade = require("../../models/copytrade")
const { isIDGood, handleError } = require("../../middleware/utils");
const { getItemById } = require("../../middleware/db");
const cpgrade = require("../../models/copytrade");

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getMasters = async (req, res) => {
  try {

    let findData = {}
    let lastTrade = {}
    if (req.body.name) {
      findData = {
        $and: [{ trader_type: "master" }, { name: { $regex: new RegExp(req.body.name, 'i') } }]
      }
      const mastersList = await User.find(findData);

      let userWithTrade = [];
      if (mastersList.length > 0) {
        for (let i = 0; i < mastersList.length; i++) {
          lastTrade = await Trade.findOne({ user_id: mastersList[i]._id }).sort({ 'createdAt': -1 })
          if (!lastTrade) {

            lastTrade = {
              ouid: "",
              symbol: "",
              order_id: "",
              pair: "",
              order_type: "",
              price: "",
              volume: "",
              value: "",
              fees: "",
              commission: "",
              remaining: "",
              stoplimit: "",
              status: "",
              completed_status: "",
              posId: "",
              tradeId: "",
              posStatus: "",
              priceperunit: "",
              leverage: "",
              margin_amount: "",
              margin_ratio: "",
              convert_price: "",
              loan_amount: "",
              _id: "",
              user_id: "",
              loan_user_id: "",
              trade_pair_id: "",
              asset_id: "",
              trade_type: "",
              trade_at: "",
              entry_price: "",
              trade_in: "",
              createdAt: "",
              updatedAt: "",
              __v: "",
            }
          }
          let tradeLiost = await Trade.find({ user_id: mastersList[i]._id });
          userWithTrade.push({
            master: mastersList[i],
            lastTrade: lastTrade,
            tradeList: tradeLiost.length,
          });
        }

        res.status(200).json({
          success: true,
          result: userWithTrade,
          message: "Masters found successfully"
        })
      } else {
        res.status(200).json({
          success: false,
          result: "",
          message: "Masters not found",
        });
      }
    }
    else if (req.body.exchange) {
      findData = {
        exchange: { $regex: new RegExp(req.body.exchange, 'i') }
      }
      console.log(findData)
      const mastersList = await CopyTrade.find(findData).populate("user_id");
      console.log(mastersList[0].user_id._id, "hgjhg")
      let userWithTrade = [];
      if (mastersList.length > 0) {
        for (let i = 0; i < mastersList.length; i++) {
          //  if(mastersList[i]?.user_id?._id){
          const ismastersDetail = await User.findOne({ $and: [{ trader_type: "master" }, { _id: mastersList[i]?.user_id?._id }] });
          if (ismastersDetail) {

            lastTrade = await Trade.findOne({ user_id: mastersList[i]?.user_id?._id }).sort({ 'createdAt': -1 })
            if (!lastTrade) {

              lastTrade = {
                ouid: "",
                symbol: "",
                order_id: "",
                pair: "",
                order_type: "",
                price: "",
                volume: "",
                value: "",
                fees: "",
                commission: "",
                remaining: "",
                stoplimit: "",
                status: "",
                completed_status: "",
                posId: "",
                tradeId: "",
                posStatus: "",
                priceperunit: "",
                leverage: "",
                margin_amount: "",
                margin_ratio: "",
                convert_price: "",
                loan_amount: "",
                _id: "",
                user_id: "",
                loan_user_id: "",
                trade_pair_id: "",
                asset_id: "",
                trade_type: "",
                trade_at: "",
                entry_price: "",
                trade_in: "",
                createdAt: "",
                updatedAt: "",
                __v: "",
              }
            }

            let tradeLiost = await Trade.find({ user_id: mastersList[i]?.user_id?._id });
            userWithTrade.push({
              master: mastersList[i].user_id,
              lastTrade: lastTrade,
              tradeList: tradeLiost.length,
            });
          }
          // }

        }

        res.status(200).json({
          success: true,
          result: userWithTrade,
          message: "Masters found successfully"
        })
      } else {
        res.status(200).json({
          success: false,
          result: "",
          message: "Masters not found",
        });
      }
    }
    else if (req.body.rating) {
      console.log(req.body.rating)
      const ratingArray = req.body.rating.split(',')
      console.log(ratingArray, ratingArray.length)
      if (ratingArray.length == 1) {
        findData = {
          $and: [{ trader_type: "master" }, { rating: { $lte: ratingArray[0] } }]
        }
      }
      else if (ratingArray.length == 2) {
        findData = {
          $and: [{ trader_type: "master" }, { rating: { $lte: ratingArray[0] } }, { rating: { $gte: ratingArray[1] } }]
        }
      }

      const mastersList = await User.find(findData).sort({ 'rating': -1 });

      let userWithTrade = [];
      if (mastersList.length > 0) {
        for (let i = 0; i < mastersList.length; i++) {
          lastTrade = await Trade.findOne({ user_id: mastersList[i]._id }).sort({ 'createdAt': -1 })
          if (!lastTrade) {

            lastTrade = {
              ouid: "",
              symbol: "",
              order_id: "",
              pair: "",
              order_type: "",
              price: "",
              volume: "",
              value: "",
              fees: "",
              commission: "",
              remaining: "",
              stoplimit: "",
              status: "",
              completed_status: "",
              posId: "",
              tradeId: "",
              posStatus: "",
              priceperunit: "",
              leverage: "",
              margin_amount: "",
              margin_ratio: "",
              convert_price: "",
              loan_amount: "",
              _id: "",
              user_id: "",
              loan_user_id: "",
              trade_pair_id: "",
              asset_id: "",
              trade_type: "",
              trade_at: "",
              entry_price: "",
              trade_in: "",
              createdAt: "",
              updatedAt: "",
              __v: "",
            }
          }
          let tradeLiost = await Trade.find({ user_id: mastersList[i]._id });

          userWithTrade.push({
            master: mastersList[i],
            lastTrade: lastTrade,
            tradeList: tradeLiost.length,
          });
        }

        res.status(200).json({
          success: true,
          result: userWithTrade,
          message: "Masters found successfully"
        })
      } else {
        res.status(200).json({
          success: false,
          result: "",
          message: "Masters not found",
        });
      }
    }
    else if (req.body.type) {

      const mastersList = await User.find({ trader_type: "master" });

      let userWithTrade = [];
      console.log(mastersList.length)
      if (mastersList.length > 0) {
        for (let i = 0; i < mastersList.length; i++) {
          lastTrade = await Trade.findOne({ user_id: mastersList[i]._id }).sort({ 'createdAt': -1 })
          if (!lastTrade) {

            lastTrade = {
              ouid: "",
              symbol: "",
              order_id: "",
              pair: "",
              order_type: "",
              price: "",
              volume: "",
              value: "",
              fees: "",
              commission: "",
              remaining: "",
              stoplimit: "",
              status: "",
              completed_status: "",
              posId: "",
              tradeId: "",
              posStatus: "",
              priceperunit: "",
              leverage: "",
              margin_amount: "",
              margin_ratio: "",
              convert_price: "",
              loan_amount: "",
              _id: "",
              user_id: "",
              loan_user_id: "",
              trade_pair_id: "",
              asset_id: "",
              trade_type: "",
              trade_at: "",
              entry_price: "",
              trade_in: "",
              createdAt: "",
              updatedAt: "",
              __v: "",
            }
          }
          let tradeLiost = await Trade.find({ user_id: mastersList[i]._id });
          userWithTrade.push({
            master: mastersList[i],
            lastTrade: lastTrade,
            tradeList: tradeLiost.length,
          });
        }

        res.status(200).json({
          success: true,
          result: userWithTrade,
          message: "Masters found successfully"
        })
      } else {
        res.status(200).json({
          success: false,
          result: "",
          message: "Masters not found",
        });
      }
    }
    else {

      const mastersList = await User.find({ trader_type: "master" });

      let userWithTrade = [];
      console.log(mastersList.length)
      if (mastersList.length > 0) {
        for (let i = 0; i < mastersList.length; i++) {
          lastTrade = await Trade.findOne({ user_id: mastersList[i]._id }).sort({ 'createdAt': -1 })
          if (!lastTrade) {

            lastTrade = {
              ouid: "",
              symbol: "",
              order_id: "",
              pair: "",
              order_type: "",
              price: "",
              volume: "",
              value: "",
              fees: "",
              commission: "",
              remaining: "",
              stoplimit: "",
              status: "",
              completed_status: "",
              posId: "",
              tradeId: "",
              posStatus: "",
              priceperunit: "",
              leverage: "",
              margin_amount: "",
              margin_ratio: "",
              convert_price: "",
              loan_amount: "",
              _id: "",
              user_id: "",
              loan_user_id: "",
              trade_pair_id: "",
              asset_id: "",
              trade_type: "",
              trade_at: "",
              entry_price: "",
              trade_in: "",
              createdAt: "",
              updatedAt: "",
              __v: "",
            }
          }
          let tradeLiost = await Trade.find({ user_id: mastersList[i]._id });
          const filterData = await cpgrade.find({ "follower_user_id.follower_id": mastersList[i]._id })
          console.log(filterData, 'filterData');
          userWithTrade.push({
            master: mastersList[i],
            lastTrade: lastTrade,
            tradeList: tradeLiost.length,
            followerList: filterData.length
          });
        }

        res.status(200).json({
          success: true,
          result: userWithTrade,
          message: "Masters found successfully"
        })
      } else {
        res.status(200).json({
          success: false,
          result: "",
          message: "Masters not found",
        });
      }
    }



  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { getMasters };
