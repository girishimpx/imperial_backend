const USER = require('../../../models/user')
const Referral = require('../../../models/referral')



const updateReferral = async (referralId) => {
    const user1 = await Referral.find({ referral_id: referralId })
    console.log(user1, 'user1');
    const allRewarded = user1.every(referral => referral.is_reward == 2);
    console.log(allRewarded, 'allRewarded');
    if (allRewarded) {
        const UpdateData = {
            is_reward: 2
        }
        const updateBalance = await USER.findOneAndUpdate({ _id: referralId }, UpdateData)
        if (updateBalance) {
            return true
        }
        else {
            return false
        }
    }
}

module.exports = { updateReferral }