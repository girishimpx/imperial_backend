const { matchedData } = require("express-validator");
const Supportmodel = require("../../models/SUPPORT1");
const { handleError } = require("../../middleware/utils");
const Admin = require("../../models/admin");

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const AddQuery = async (req, res) => {
  try {
    const user = req.user;
    req = matchedData(req);
    const admin = await Admin.find({ email: "admin@admin.com" });
    if (admin.length > 0) {
      const messageExist = await Supportmodel.find({ user_id: user._id });
      if (messageExist.length > 0) {
        Supportmodel.findOneAndUpdate(
          {
            user_id: user._id,
          },
          {
            $push: {Query:{
              author: "user",
              message: req.message,
              time: Date.now(),
            }},
          },
          (err, done) => {
            if (err) {
              res.status(400).json({
                success: false,
                result: "",
                message: "Queries not updated",
              });
            } else {
              res.status(200).json({
                success: true,
                result: "",
                message: "Queries Added successfully",
              });
            }
          }
        );
      } else {
        Supportmodel.create(
          {
            admin: admin[0]._id,
            user_id: user._id,
            Query: { author: "user", message: req.message, time: Date.now() },
          },
          (err, done) => {
            if (err) {
              res.status(400).json({
                success: false,
                result: "",
                message: "Queries not created",
              });
            } else {
              res.status(200).json({
                success: true,
                result: "",
                message: "Queries created successfully",
              });
            }
          }
        );
      }
    } else {
      res.status(400).json({
        success: false,
        result: "",
        message: "Admin Not Found",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};
module.exports = { AddQuery };
