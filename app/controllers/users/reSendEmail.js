const { matchedData } = require("express-validator");
const { handleError } = require("../../middleware/utils");
const User = require("../../models/user");
const Kyc = require("../../models/kyc");
const { generateToken } = require('../auth/helpers/generateToken')
const { sendRegistrationEmailMessage } = require('../../middleware/emailer')
const ejs = require('ejs')
const path = require('path')

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const reSendEmail = async (req, res) => {
    try {
        if (req.body.email) {
            const locale = req.getLocale()
            const user = await User.findOne({ email: req.body.email })
            console.log("🚀 ~ file: reSendEmail.js:18 ~ reSendEmail ~ user:", user)
            if (user) {
                const response = await generateToken(user._id)
                const filedata = path.join(__dirname, '../../../views/verify.ejs')
                const sends = await ejs.renderFile(
                    filedata,
                    { username: user.name, url: `https://app.imperialx.exchange/tokenpage/${response}` },
                    async (err, str) => {
                        if (err) {
                            return err
                        } else {
                            return await sendRegistrationEmailMessage(locale, user, str)
                        }
                    }
                )
                console.log(sends, "send")
                res.status(200).json({
                    success: true,
                    result: "",
                    message: "Mail Send Successfully",
                });

            } else {
                res.status(400).json({
                    success: false,
                    result: "",
                    message: "User Not Found",
                });
            }
        } else {
            res.status(400).json({
                success: false,
                result: "",
                message: "Please Enter email",
            });
        }

    } catch (error) {
        handleError(res, error);
    }
};

module.exports = { reSendEmail };
