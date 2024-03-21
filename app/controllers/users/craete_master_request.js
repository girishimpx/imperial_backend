const { matchedData } = require("express-validator");
const { handleError } = require("../../middleware/utils");
const User = require("../../models/user");
const masterRequest = require("../../models/Master_Request");

const speakeasy = require("speakeasy");

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const create_masket_request = async (req, res) => {
  try {
    const user = req.user;
    if (user.trader_type == "user") {
      const isRequestExist = await masterRequest.find({ user_id: user._id });
      if (isRequestExist.length > 0) {
        res.status(400).json({
          success: false,
          result: "",
          message: "You have Reqested already",
        });
      } else {
        masterRequest
          .create({ user_id: user._id })
          .then((done) => {
            res.status(200).json({
              success: true,
              result: "",
              message: "Request created successfully",
            });
          })
          .catch((err) => {
            res.status(400).json({
              success: false,
              result: "",
              message: "Request didn't create",
            });
          });
      }
    } else {
      res.status(400).json({
        success: false,
        result: "",
        message: "Already you are a master",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { create_masket_request };
