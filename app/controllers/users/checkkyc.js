const { matchedData } = require("express-validator");
const { handleError } = require("../../middleware/utils");
const User = require("../../models/user");

const speakeasy = require("speakeasy");

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const checkKyc = async (req, res) => {
  try {
const user = req.user

    if (user.kyc_verify) {
        
      res.status(200).json({
        success: true,
        result: true,
        message: "KYC Verified",
      });
    } else{
      res.status(400).json({
        success: true,
        result: false,
        message: "KYC Not Verified",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { checkKyc };
