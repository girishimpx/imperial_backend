const { matchedData } = require('express-validator')
const { handleError } = require('../../middleware/utils')
const User = require('../../models/user')

const speakeasy = require('speakeasy')

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const disable2FA = async (req, res) => {
    try {
        const user_id = req.user._id
        const user = await User.findOne({ _id: user_id })

        if (user.f2A_Status === 'false') {
            res.status(400).json({
                success: false,
                result: null,
                message: "2FA Already Disabled"
            })
        } else {
            await User.findByIdAndUpdate({ _id: user._id }, { f2A_Status: 'false' })
            res.status(200).json({
                success: true,
                result: null,
                message: "2FA Successfully Disabled"
            })
        }



    } catch (error) {
        handleError(res, error)
    }
}

module.exports = { disable2FA }
