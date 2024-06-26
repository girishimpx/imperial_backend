const USER = require('../../models/user')
const mongoose = require("mongoose");
const { handleError } = require('../../middleware/utils')
const Referral = require('../../models/referral')
const { updateReferral } = require('./helpers/updateReferral')
const updateReedem = async (req, res) => {
    try {

        const isApproved = await Referral.findOne({ _id: req.body._id })
        console.log(isApproved, req.body._id, 'isApproved');
        if (isApproved.is_reward == 1) {
            // console.log(req.body, 'REQUEST')
            const updateReedeme = {
                is_reward: 2,
                amount: 0
                // $inc: { amount: - req.body.amount }
            }
            const updateAmount = {
                $inc: { escrow_refer_balance: - req.body.amount }
            }

            const user = await Referral.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body._id) }, updateReedeme)
            const updateBalance = await USER.findOneAndUpdate({ _id: req.body.referralId }, updateAmount)
            // console.log(user, 'user');

            if (updateBalance) {
                const updateIs_reward = await updateReferral(req.body.referralId)
                console.log(updateIs_reward, 'reward');
                res.status(200).json({
                    success: true,
                    result: 'TEST',
                    message: 'Redeem Updated successfully'
                })
            } else {
                res.status(200).json({
                    success: false,
                    result: '',
                    message: 'failed to approve'
                })
            }
        }
        else {
            res.status(200).json({
                success: false,
                result: '',
                message: 'User Already approved For Redeem'
            })
        }

    } catch (error) {
        handleError(res, error)
    }
};
module.exports = { updateReedem };


// if (req.body.eligible) {
//     updateReedeme = {
//         iseligible: 'Approved',
//         redeem_points: req.body.redeempoints
//     }
// } else if (req.body.redeempoints) {
//     updateReedeme = {
//         redeem_points: req.body.redeempoints
//     }
// }