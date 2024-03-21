const User = require("../../models/user");
const Kyc = require("../../models/kyc");
const { matchedData } = require("express-validator");
const { isIDGood, handleError } = require("../../middleware/utils");
const { getItemById } = require("../../middleware/db");

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getMyKyc = async (req, res) => {
  try {
    const user = req.user;

    let userkyc = await Kyc.findOne({ user_id: user._id });
    if (userkyc) {
      res.status(200).json({
        success: true,
        return: userkyc,
        message: "Data Found Successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        return: "Kyc",
        message: "Data Not Found",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { getMyKyc };
