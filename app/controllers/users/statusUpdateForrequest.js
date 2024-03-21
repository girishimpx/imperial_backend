const { matchedData } = require("express-validator");
const { handleError } = require("../../middleware/utils");
const User = require("../../models/user");
const masterRequest = require("../../models/Master_Request");
const notification = require("../../models/notification");
const mongoose = require("mongoose");

const speakeasy = require("speakeasy");

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateResponseformaster = async (req, res) => {
  try {
    const user = req.user;
    req = matchedData(req);
    const goodID = mongoose.Types.ObjectId.isValid(req._id);
    if (goodID) {
      const exist = await masterRequest.findById({ _id: req._id });
      if (exist) {
        if (req.status == "approved") {
          const updateStatus = await masterRequest.findByIdAndUpdate(
            { _id: req._id },
            req,
            (err, done) => {
              if (err) {
                res.status(400).json({
                  success: false,
                  result: "",
                  message: "Status not updated",
                });
              } else {
                const user = User.findByIdAndUpdate(
                  { _id: exist.user_id },
                  {
                    trader_type: "master",
                  },
                  (err, done) => {
                    if (err) {
                      res.status(400).json({
                        success: false,
                        result: "",
                        message: "approved but not convert as master",
                      });
                    } else {
                      notification.create(
                        {
                          message: "congrats!! you are upgraded as master",
                          user_id: exist.user_id,
                          for: "Master Request ",
                          status:"good"
                        },
                        (reject, resolve) => {
                          if (reject) {
                            res.status(400).json({
                              success: false,
                              result: "",
                              message:
                                "User successfully convert into Master but notification did not shown",
                            });
                          } else {
                            res.status(200).json({
                              success: true,
                              result: "",
                              message: "User successfully convert into Master",
                            });
                          }
                        }
                      );
                    }
                  }
                );
                res.status(200).json({
                  success: true,
                  result: "",
                  message: "status changed successfully",
                });
              }
            }
          );
        } else {
          const updateStatus = await masterRequest.findByIdAndUpdate(
            { _id: req._id },
            req,
            (err, done) => {
              if (err) {
                res.status(400).json({
                  success: false,
                  result: "",
                  message: "Status not updated",
                });
              } else {

                notification.create(
                  {
                    message: "Your request to become a master is rejected",
                    user_id: done.user_id,
                    for: "Master Request",
                    status:"bad"
                  },
                  (reject, resolve) => {
                    if (reject) {
                      res.status(400).json({
                        success: false,
                        result: "",
                        message:
                          "User successfully convert into Master but notification did not shown",
                      });
                    } else {
                      res.status(200).json({
                        success: true,
                        result: "",
                        message: "User successfully convert into Master",
                      });
                    }
                  }
                );


                res.status(200).json({
                  success: true,
                  result: "",
                  message: "status changed successfully",
                });
              }
            }
          );
        }
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
    // const isRequestExist = await masterRequest.find({ user_id: user._id });

    // res.status(400).json({
    //   success: false,
    //   result: "",
    //   message: "Request didn't create",
    // });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { updateResponseformaster };
