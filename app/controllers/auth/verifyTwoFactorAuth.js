const { matchedData } = require('express-validator')
const { handleError } = require('../../middleware/utils')
const User = require('../../models/user')

const speakeasy = require('speakeasy')

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const verifyTwoFactorAuth = async (req, res) => {
    try {
        const user_id = req.user._id
        const data = await matchedData(req)
        const user = await User.findOne({ _id: user_id })

            const { base32: secret } = user.f2A_creds;
            const verified = await speakeasy.totp.verify({
                secret: secret,
                encoding: "base32",
                token: data.secret,
            });
            if (verified) {
                await User.findOneAndUpdate({ _id: user_id }, { f2A_Status: 'true' })
                res.status(200).json({
                    success: true,
                    result: verified,
                    message: "2FA Verified Successfully"
                })
            } else {
                res.status(400).json({
                    success: false,
                    result: null,
                    message: "Invalid Code"
                })
            }
        

    } catch (error) {
        handleError(res, error)
    }
}

module.exports = { verifyTwoFactorAuth }
