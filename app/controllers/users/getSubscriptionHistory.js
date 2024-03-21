const { matchedData } = require('express-validator')
const Users = require('../../models/user')
const copytrade = require('../../models/copytrade')
const { getItemTrade } = require('../../middleware/db/getItemTrade')
const { handleError } = require('../../middleware/utils')
const axios = require('axios')

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getSubscriptionHistory = async (req, res) => {
  try {
    const datas = await copytrade.aggregate([
      {
        $lookup: {
          from: 'users', 
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$follower_user_id',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'follower_user_id.follower_id',
          foreignField: '_id',
          as: 'follower',
        },
      },
      
      {
        $project: {
          _id: 1,
          user_id: {
            $cond: {
              if: {
                $and: [
                  { $isArray: '$user._id' },
                  { $gt: [{ $size: '$user._id' }, 0] }
                ]
              },
              then: { $arrayElemAt: ['$user._id', 0] },
              else: null
            }
          },
          user_name: {
            $cond: {
              if: {
                $and: [
                  { $isArray: '$user.name' },
                  { $gt: [{ $size: '$user.name' }, 0] }
                ]
              },
              then: { $arrayElemAt: ['$user.name', 0] },
              else: null
            }
          },
          exchange: '$exchange',
          trade_base: '$trade_base',
          follower_id: '$follower_user_id.follower_id', 
          follower_name: {
            $cond: {
              if: {
                $and: [
                  { $isArray: '$follower.name' },
                  { $gt: [{ $size: '$follower.name' }, 0] }
                ]
              },
              then: { $arrayElemAt: ['$follower.name', 0] },
              else: null 
            }
          },
          amount: '$follower_user_id.amount'
        }
      }
    ]);

    if(datas.length > 0){
        res.status(200).json({
            success: true,
            result: datas,
            message: "Data Found successfully"
        })
    } else {
        res.status(400).json({
            success: false,
            result: null,
            message: "Data not found"
        })
    }

  }  catch (error) {
    handleError(res, error)
}
};


module.exports = { getSubscriptionHistory }
