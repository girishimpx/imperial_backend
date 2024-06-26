const USER = require('../../models/user')
const Referral = require('../../models/referral')

const { handleError } = require('../../middleware/utils')

const getRedemlist = async (req, res) => {
    try {
        const redeemlist = await Referral.aggregate([
            {
                $match: {
                    is_reward: 1,
                    is_deposit: true,
                    is_copytrade: true
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'referral_id',
                    foreignField: '_id',
                    as: 'ReferredBy'
                }
            },
            {
                $unwind: '$ReferredBy',

            },
            {
                $lookup: {
                    from: 'kycs',
                    localField: 'referral_id',
                    foreignField: 'user_id',
                    as: 'accountdetailes'
                }
            },
            {
                $unwind: '$accountdetailes'
            },
            {
                $project: {
                    "_id": 1,
                    "amount": 1,
                    'user.name': 1,
                    'user.email': 1,
                    'user.referred_by_code': 1,
                    'user.referred_by_id': 1,
                    'ReferredBy.name': 1,
                    'ReferredBy.email': 1,
                    'ReferredBy.redeem_points': 1,
                    'accountdetailes.account_no': 1,
                    'accountdetailes.ifsc_code': 1,
                    'accountdetailes.bank_name': 1,
                }
            },
        ])

        // const h1 = await USER.find({iseligible : {$exists: true}})

        console.log(redeemlist, 'redeem');

        if (redeemlist.length > 0) {
            res.status(200).json({
                success: true,
                result: redeemlist,
                message: 'Data found succesfully'
            })
        } else {
            res.status(201).json({
                success: false,
                result: [],
                message: 'No Data Found'
            })
        }

    } catch (error) {
        handleError(res, error)
    }
};
module.exports = { getRedemlist };
