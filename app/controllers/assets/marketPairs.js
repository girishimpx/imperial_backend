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
const marketPairs = async (req, res) => {
    try {
        if (req.body.type) {
            var futurepaisdata
            if (req.body.type === "all") {
                futurepaisdata = await tickers.aggregate([
                    {
                        $unwind: '$data',
                    },
                    {
                        $match: { 'data.instId': /USDT/ }
                    }
                ]);
            } else  {
               
                futurepaisdata = await tickers.aggregate([
                    {
                        $unwind: '$data',
                    },
                    {
                        $match: {
                            'data.instType':  { $regex: new RegExp(req.body.type, 'i') },
                        },
                    },
                ]);
            }
            if (futurepaisdata.length > 0) {
                res.status(200).json({
                    success: true,
                    result: futurepaisdata,
                    message: "Market pairs fetched successfully",
                });
            } else {
                res.status(400).json({
                    success: false,
                    result: "",
                    message: "Data not found",
                });
            }
        } else {
            res.status(400).json({
                success: false,
                result: "",
                message: "Please Enter type",
            });
        }

    } catch (error) {
        handleError(res, error);
    }
};

module.exports = { marketPairs };
