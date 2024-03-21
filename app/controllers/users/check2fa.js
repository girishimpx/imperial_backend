const { matchedData } = require("express-validator");
const { handleError } = require("../../middleware/utils");
const User = require("../../models/user");

const speakeasy = require("speakeasy");

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const check2FA = async (req, res) => {
  try {

    if (req.user.f2A_Status == "true") {
        
      res.status(200).json({
        success: true,
        result: true,
        message: "2FA Enabled",
      });
    } else if (req.user.f2A_Status == "false") {
        console.log(2)
      res.status(200).json({
        success: true,
        result: false,
        message: "2FA Disabled",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { check2FA };
