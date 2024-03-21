const User = require("../../models/user");
const { matchedData } = require("express-validator");
const { isIDGood, handleError } = require("../../middleware/utils");
const { getItemById } = require("../../middleware/db");
const mongoose = require("mongoose");
/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const suspendUserAndMaster = async (req, res) => {
  try {
    req = matchedData(req);
    const goodID = mongoose.Types.ObjectId.isValid(req.id);
    if (goodID) {
      const userCheck = await User.findById({ _id: req.id });
      if (userCheck) {
        User.findByIdAndUpdate(
          { _id: userCheck._id },
          { suspend: req.suspend },
          (err, done) => {
            if (err) {
              res.status(400).json({
                success: false,
                result: "",
                message: "suspend not updated",
              });
            } else {
              res.status(200).json({
                success: true,
                result: "",
                message: `${userCheck.trader_type} has been ${
                  req.suspend == true ? "locked" : "unlocked"
                }`,
              });
            }
          }
        );
      } else {
        res.status(400).json({
          success: false,
          result: "",
          message: "Data not found",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        result: "",
        message: "Id Malformed",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { suspendUserAndMaster };
