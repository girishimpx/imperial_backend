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
const marketPairsAuth = async (req, res) => {
    try {
        const id = req.user._id
        if (req.body.type) {
            var futurepaisdata
            if (req.body.type === "all") {
                futurepaisdata = await tickers.aggregate([
                    {
                        $unwind: '$data',
                    },
                    {
                        $match: { 'data.instId': /USDT/ }
                    },

                ]);
            } else {

                futurepaisdata = await tickers.aggregate([
                    {
                        $unwind: '$data',
                    },
                    {
                        $match: {
                            'data.instType': { $regex: new RegExp(req.body.type, 'i') },
                        },
                    },
                    {
                        $addFields: {
                            userIndex: {
                                $indexOfArray: ['$data.users_id', id]
                            }
                        }
                    },
                    {
                        $sort: {
                            userIndex: -1, // Sort by userIndex in ascending order
                            'data.users_id': 1, // Then sort by users_id in descending order for other cases
                            // 'id': 1 // Additional sorting field if needed
                        }
                    }
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

module.exports = { marketPairsAuth };
