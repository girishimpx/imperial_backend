const model = require("../../models/Master_Request");
const { matchedData } = require("express-validator");
const { isIDGood, handleError } = require("../../middleware/utils");
const { getItemById } = require("../../middleware/db");
const { listInitOptions } = require("../../middleware/db/listInitOptions");

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getMasterRequest = async (req, res) => {
  try {
    const user = req.user;
    const find = await model.find({ user_id: user._id });
    if (find.length > 0) {
      res.status(200).json({
        success: true,
        result: find,
        message: "Data found successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Data not found",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { getMasterRequest };
