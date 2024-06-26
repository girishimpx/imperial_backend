const referral = require('../../models/referral')
const { handleError } = require('../../middleware/utils')
const User = require('../../models/user')

const updateReedem = async (req, res) => {
    const id = req.body.id
    const redeem_points = req.body.redeem_points
    try {
        const update = await referral.find({ referral_id: id })
        // let updateStatus = []
        for (let i = 0; i < update.length; i++) {
            // console.log(i, 'loop');
            // console.log(update[i], 'update');
            if (update[i].is_reward == 0) {
                await referral.findOneAndUpdate({ _id: update[i]._id, referral_id: id }, { $set: { is_reward: 1 } })
            }
        }

        // if (updateStatus) {
        const updatedata = {
            redeem_points: '0',
            $inc: { escrow_refer_balance: redeem_points },
            // escrow_refer_balance: redeem_points,
            is_reward: 1
        }
        const updateBalance = await User.findOneAndUpdate({ _id: id }, updatedata)
        // console.log(updateBalance, 'updateBalance');
        if (updateBalance) {
            res.status(200).json({
                success: true,
                message: "Redeem Request Completed",
                result: ''
            })
        }
        else {
            res.status(201).json({
                success: false,
                message: "Something Went Wrong",
                result: ''
            })
            // }
        }


    } catch (error) {
        handleError(res, error)
    }

}

module.exports = { updateReedem }