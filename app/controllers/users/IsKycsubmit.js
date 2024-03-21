const { matchedData } = require("express-validator");
const { handleError } = require("../../middleware/utils");
const User = require("../../models/user");
const Kyc = require("../../models/kyc");

const speakeasy = require("speakeasy");

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const IsKycSubmit = async (req, res) => {
  try {
    const user = req.user;

    const kycExist = await Kyc.find({ user_id: user._id });

    if (kycExist.length > 0) {
      res.status(200).json({
        success: true,
        result: "",
        message: "KYC Submitted",
      });
    } else {
      res.status(400).json({
        success: false,
        result: "",
        message: "KYC Not Sumbited",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { IsKycSubmit };
