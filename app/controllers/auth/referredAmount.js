const referredAmount = require('../../models/referralAmount')
const { handleError } = require('../../middleware/utils')

const createReferralAmount = async (req, res) => {
    const amount = req.body.amount
    const findAmount = await referredAmount.findOne({})
    console.log(findAmount, 'findamount');
    try {
        if (findAmount) {
            const updateAmount = await referredAmount.findOneAndUpdate({ _id: findAmount._id }, { $set: { amount: amount } })
            if (updateAmount) {
                res.status(200).json({
                    success: true,
                    message: "Amount Updated Successfully",
                    result: updateAmount
                })
            }

        }
        else {
            const createAmount = new referredAmount({
                amount: amount
            })
            createAmount.save()
            if (createAmount) {
                res.status(200).json({
                    success: true,
                    message: "Amount Added Successfully",
                    result: createAmount
                })
            }
            else {
                res.status(201).json({
                    success: false,
                    message: "Something went wrong",
                    result: ''
                })
            }
        }
    } catch (error) {
        handleError(res, error)
    }
}

const findReferralAmount = async (req, res) => {
    try {
        const findAmount = await referredAmount.findOne({})
        if (findAmount) {
            res.status(200).json({
                success: true,
                message: "Amount Found",
                result: findAmount.amount
            })
        }
        else {
            res.status(201).json({
                success: false,
                message: "No Data Found",
                result: ''
            })
        }
    } catch (error) {
        handleError(res, error)
    }
}


module.exports = { createReferralAmount, findReferralAmount }