
const users = require('../../models/user')
const { handleError, isIDGood } = require("../../middleware/utils");

const withDrawCheckOTP = async (req, res) => {
    try {
        if (req.body.withdrawOtp) {
            const user = req.user;
            const exist = await users.findOne({ _id: user._id })
            if (exist) {
                if (exist?.withdrawOtp != 0) {
                    if (exist?.withdrawOtp == Number(req.body.withdrawOtp)) {
                        await users.findOneAndUpdate({ _id: user._id }, { withdrawOtp: 0 })
                        res.status(200).json({
                            success: true,
                            result: null,
                            message: "OTP Verified Successfully"
                        })
                    } else {
                        res.status(200).json({
                            success: false,
                            result: null,
                            message: "Wrong OTP"
                        })
                    }
                } else {
                    res.status(200).json({
                        success: false,
                        result: null,
                        message: "OTP Already Verified"
                    })
                }

            } else {
                res.status(200).json({
                    success: false,
                    result: null,
                    message: "User Not Found"
                })
            }

        } else {
            res.status(200).json({
                success: false,
                result: null,
                message: "Please Enter OTP"
            })
        }
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = { withDrawCheckOTP };
