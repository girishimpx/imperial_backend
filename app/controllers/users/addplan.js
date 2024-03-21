const User = require('../../models/user')
const Plan = require('../../models/plans')
const { handleError } = require('../../middleware/utils')
const { getItemById } = require("../../middleware/db");
const { isNumber } = require('lodash');
/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const addPlan = async (req, res) => {
    try {
        const user_id = req.user._id
        console.log("USER IDs", user_id)

        const plan_type = req.body.plan_type
        const plan_name = req.body.plan_name
        const plans = await Plan.findOne({ plan_name: plan_name })
        const isUser = await User.findOne({ _id: user_id })
        if (plan_type === "Month") {
            console.log(isUser.referal_money, plans.per_month)
            if (isUser.referal_money >= plans.per_month) {
                console.log(Date.now())

                let data = new Date(Date.now())
                const afteroneonemonth = data.setMonth(data.getMonth() + 1)
                let userData = {}
                userData.endDate = new Date(afteroneonemonth).toUTCString()
                userData.end = afteroneonemonth
                userData._id = user_id
                userData.plan = plan_type
                const Users = await User.findOneAndUpdate({ _id: user_id }, { $inc: { referal_money: -plans.per_month },$set: { ispaid: "true" }})

                plans.user_id.push(userData)
                plans.save()

                res.status(200).json({
                    success: true,
                    result: plans,
                    message: "Your Monthly Plan is Selected"
                }
                )
            } else {
                res.status(400).json({
                    success: false,
                    result: null,
                    message: "Insufficient Balance"
                })
            }
        } else {
            console.log(isUser.referal_money, plans.per_year)
            if (isUser.referal_money >= plans.per_year) {
                console.log(Date.now())
                let userData = {}
                let data = new Date(Date.now())
                const afteroneYear = data.setFullYear(data.getFullYear() + 1)
                userData.endDate = new Date(afteroneYear).toUTCString()
                userData.end = afteroneYear
                userData._id = user_id
                userData.plan = plan_type
                const Users = await User.findOneAndUpdate({ _id: user_id }, { $inc: { referal_money: -plans.per_year },$set: { ispaid: "true" } })

                plans.user_id.push(userData)
                plans.save()
                res.status(200).json({
                    success: true,
                    result: plans,
                    message: "Your Yearly Plan is Selected"
                }
                )
            } else {
                res.status(400).json({
                    success: false,
                    result: null,
                    message: "Insufficient Balance"
                })
            }
        }



    } catch (error) {
        handleError(res, error)
    }
}

module.exports = { addPlan }
