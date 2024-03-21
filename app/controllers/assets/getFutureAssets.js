const { matchedData } = require('express-validator')
const tradepair = require('../../models/futurePairs')
const tickers = require('../../models/allTickers')
const { getItemTrade } = require('../../middleware/db/getItemTrade')
const { handleError } = require('../../middleware/utils')
const axios = require('axios')

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getFutureAssets = async (req, res) => {
    try {
        const id = req.user._id
        if (req.body.pair) {
            const datas = await tickers.aggregate([
                {
                  $unwind: '$data',
                },
                {
                  $match: {
                    'data.instType': req.body.pair,
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
              ])


            if(datas.length > 0){
                res.status(200).json({
                    success: true,
                    result: datas,
                    message: "Pair Found successfully"
                })
            } else {
                res.status(400).json({
                    success: false,
                    result: null,
                    message: "Data not found"
                })
            }

            }else {
                res.status(400).json({
                    success: false,
                    result: null,
                    message: "Please Enter Pair"
                })

        } 
        }catch (error) {
            handleError(res, error)
        }

    } 

module.exports = { getFutureAssets }
