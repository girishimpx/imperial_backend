const { matchedData } = require('express-validator')
const { handleError } = require('../../middleware/utils')
const User = require('../../models/user')

const speakeasy = require('speakeasy')

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const twoFactorAuth = async (req, res) => {
    try {
        const user_id = req.user._id
        const user = await User.findOne({ _id: user_id })
        if (user.f2A_Status === "true") {
            res.status(400).json({
                success: false,
                result: null,
                message: "2FA Already Generated"
            })
        } else {
            const userInfo = await speakeasy.generateSecret()
            if (userInfo) {
                await User.findByIdAndUpdate({ _id: user_id }, { twofa: "email", f2A_creds: userInfo })
                const secret = {
                    secret: userInfo.base32,
                    otpauth_url: userInfo.otpauth_url
                }
                res.status(200).json({
                    success: true,
                    result: secret,
                    message: "2FA Created Successfully"
                })
            } else {
                res.status(400).json({
                    success: false,
                    result: null,
                    message: "Something Went Wrong"
                })
            }

        }

    } catch (error) {
        handleError(res, error)
    }
}

module.exports = { twoFactorAuth }
