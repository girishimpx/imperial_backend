const { matchedData } = require("express-validator");
const {
  findForgotPassword,
  findUserToResetPassword,
  updatePassword,
  markResetPasswordAsUsed,
} = require("./helpers");
const { handleError } = require("../../middleware/utils");
const user = require("../../models/user");
/**
 * Reset password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const resetPassword = async (req, res) => {
  try {
    const data = matchedData(req);
    const User = await user.find({ email: data.email });

  
    if (User.length > 0) {
      if (data.otp == User[0].forgotOtp) {
        User[0].password = data.new_password;
        User[0].forgotOtp = "";

        const update = User[0].save((err, done) => {
          if (err) {
            return res.status(400).json({
              success: false,
              message: "Invalid otp1",
              result: " ",
            });
          }
          if (done) {
            return res.status(200).json({
              success: true,
              message: "Password changed successfully",
              result: done,
            });
          }
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
          result: "",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
        result: "",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { resetPassword };
