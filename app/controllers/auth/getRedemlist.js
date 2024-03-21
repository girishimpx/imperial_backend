const USER = require('../../models/user')
const { handleError } = require('../../middleware/utils')

const getRedemlist = async (req, res) => {
    try {
    const redeemlist = await USER.aggregate([
        {
            $match: {
                iseligible : {$exists : true}
            }
        },
        {
            $match: {
                iseligible : 'completed'
            }
        },
        // {
        //     $project: {
        //         _id : 1,
        //         iseligible : 1,
        //         redeem_points : 1,
        //         name : 1,
        //         email : 1,
        //         referred_by_code : 1,
        //         referred_by_id : 1,
        //         referral_code : 1,
        //         role :1
        //     }
        // },
        {
            $lookup: {
              from: 'users',
              localField: 'referred_by_id',
              foreignField: '_id',
              as: 'Following'
            }
        },
        {
            $unwind: '$Following'
        },
        {
            $lookup: {
              from: 'kycs',
              localField: '_id',
              foreignField: 'user_id',
              as: 'accountdetailes'
            }
        },
        {
            $unwind: '$accountdetailes'
        },
        {
            $project: {
                _id : 1,
                iseligible : 1,
                redeem_points : 1,
                name : 1,
                email : 1,
                referred_by_code : 1,
                referred_by_id : 1,
                referral_code : 1,
                role :1,
                // 'Following._id' : 1,
                // 'Following.iseligible' : 1,
                // 'Following.redeem_points' : 1,
                'Following.name' : 1,
                'Following.email' : 1,
                'Following.referred_by_code' : 1,
                // 'Following.referred_by_id' : 1,
                // 'Following.referral_code' : 1,
                // 'Following.role' :1,
                'accountdetailes.account_no' :1,
                'accountdetailes.ifsc_code' :1
            }
        },
    ])  
    
    // const h1 = await USER.find({iseligible : {$exists: true}})

    if(redeemlist.length > 0){
    res.status(200).json({
        success: true,
        result: redeemlist,
        message: 'Data found succesfully'
    })
    }else{
        res.status(200).json({
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
