const Model = require("../../models/notification");
const { updateItem } = require("../../middleware/db");
const { isIDGood, handleError } = require("../../middleware/utils");
const { matchedData } = require("express-validator");
const {
  assetExistsExcludingItself,
} = require("../assets/helpers/assetExistsExcludingItself");

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const NotificationChecked = async (req, res) => {
  try {
    const user = req.user;
    req = matchedData(req);

    const notification = await Model.findOneAndDelete({ _id: req.id, user_id: user._id, checked: false });
    if (notification) {
      res.status(200).json({
        success: true,
        result: "",
        message: "Notification cleared",
      });
    } else {
      res.status(400).json({
        success: false,
        result: null,
        message: "Notification Not cleared",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { NotificationChecked };
