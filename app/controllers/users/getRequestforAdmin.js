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
const getMasterRequestAdmin = async (req, res) => {
  try {
    const user = req.user;
    const findrequest = model.find().populate("user_id") 
    const option = await listInitOptions(req);
    const query = await model.paginate(findrequest, option);
    if (query.docs.length > 0) {
      res.status(200).json({
        success: true,
        result: query,
        message: "Data found successfully",
      });
    } else {
      res.status(400).json({
        success: true,
        result: null,
        message: "Data not found",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { getMasterRequestAdmin };
