const { matchedData } = require("express-validator");
const copytradehistorys = require("../../models/copytradehistory");
const cpgrade = require("../../models/copytrade");
const { handleError } = require("../../middleware/utils");
const trade = require("../../models/trade");
const { isIDGood } = require("../../middleware/utils/isIDGood");
const { listInitOptions } = require("../../middleware/db/listInitOptions");

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */



const FollowerCount = async (req, res) => {
  try {
    const user = req.user;
    req = matchedData(req)

    const filterData = await cpgrade.find({ "follower_user_id.follower_id": req.id })




    if (filterData.length > 0) {
      res.status(200).json({
        success: true,
        result: filterData.length,
        message: "Data found Successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        result: "",
        message: "Data not found",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};
module.exports = { FollowerCount };
