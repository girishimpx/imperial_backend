const { matchedData } = require("express-validator");
const User = require("../../models/user");
const trade = require("../../models/trade");
const { handleError } = require("../../middleware/utils");
const mongoose = require("mongoose");

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const lastTradeHistory = async (req, res) => {
  try {
    req = matchedData(req);
    let rows = [];


      const masterslist = await User.find({ trader_type: "master" });
      if (masterslist.length > 0) {
        for (let i = 0; i < masterslist.length; i++) {
          const lastCreatedData = await trade
            .find({ user_id: masterslist[i]._id })
            .sort({ createdAt: -1 });
          if (lastCreatedData.length > 0) {
            rows.push(lastCreatedData[0]);
          }
        }

        res.status(200).json({
          success: true,
          result: rows,
          message: "Data found successfully",
        });
      } else {
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
module.exports = { lastTradeHistory };
