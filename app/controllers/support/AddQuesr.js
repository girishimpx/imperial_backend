const { matchedData } = require("express-validator");
const Supportmodel = require("../../models/support");
const { handleError } = require("../../middleware/utils");
const trade = require("../../models/trade");
const { isIDGood } = require("../../middleware/utils/isIDGood");
const { listInitOptions } = require("../../middleware/db/listInitOptions");

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const AddQuery = async (req, res) => {
  try {
    const user = req.user;
    req = matchedData(req);
    Supportmodel.create(
      {
        Query: req.query,
        user_id:user._id
      },
      (err, done) => {
        if (err) {
          res.status(400).json({
            success: false,
            result: "",
            message: "Query not created",
          });
        } else {
          res.status(200).json({
            success: true,
            result: "",
            message: "Query added successfully",
          });
        }
      }
    );
  } catch (error) {
    handleError(res, error);
  }
};
module.exports = { AddQuery };
