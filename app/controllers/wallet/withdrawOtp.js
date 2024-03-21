const { getItemById } = require("../../middleware/db");
const wallet = require("../../models/wallet");
const asset = require("../../models/assets");
const users = require('../../models/user')
const { handleError, isIDGood } = require("../../middleware/utils");
const { matchedData } = require("express-validator");
const { WithDrawOtpEmail } = require('../../middleware/emailer')
const ejs = require('ejs')
const path = require('path')

const withdrawOtp = async (req, res) => {
    try {
        const locale = req.getLocale()
        const user = req.user;
        const exist = await users.findOne({ _id: user._id })
        if (exist) {
            const otp = Math.floor(100000 + Math.random() * 900000)
            const userss = await users.findOneAndUpdate({ _id: user._id }, { withdrawOtp: otp })
            const filedata = path.join(__dirname, '../../../views/WithdrawOtp.ejs')

            ejs.renderFile(
                filedata,
                { otp: otp, username: exist?.name },
                async (err, str) => {
                    if (err) {
                        return err
                    } else {
                        await WithDrawOtpEmail(locale, exist, str)
                    }
                }
            )
            res.status(200).json({
                success: true,
                result: null,
                message: "OTP Send Successfully"
            })
        } else {
            res.status(200).json({
                success: false,
                result: null,
                message: "User Not Found"
            })
        }


    } catch (error) {
        handleError(res, error);
    }
};

module.exports = { withdrawOtp };
