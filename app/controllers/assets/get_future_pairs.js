const { matchedData } = require("express-validator");

const tickers = require("../../models/allTickers");
const { getItemTrade } = require("../../middleware/db/getItemTrade");
const { handleError } = require("../../middleware/utils");
const axios = require("axios");

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const get_Future_pairs = async (req, res) => {
  try {
    const futurepaisdata = await tickers.find();
    if (futurepaisdata.length > 0) {
      res.status(200).json({
        success: true,
        result: futurepaisdata,
        message: "Future pairs fetched successfully",
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

module.exports = { get_Future_pairs };
