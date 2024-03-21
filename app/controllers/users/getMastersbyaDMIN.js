const User = require("../../models/user");
const Trade = require("../../models/trade");
const { matchedData } = require("express-validator");
const { isIDGood, handleError } = require("../../middleware/utils");
const { getItemById } = require("../../middleware/db");
const { listInitOptions } = require("../../middleware/db/listInitOptions");

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getMAstersByAdmin = async (req, res) => {
  try {
    const option = await listInitOptions(req);
    const mastersList = await User.paginate({ trader_type: "master" }, option);
    
    if (mastersList.docs.length > 0) {
      

      res.status(200).json({
        success: true,
        result:mastersList,
        message:"Masters found successfully"
      })
    } else {
      res.status(200).json({
        success: false,
        result: "",
        message: "Masters not found",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { getMAstersByAdmin };
