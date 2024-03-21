const { matchedData } = require("express-validator");
const { handleError } = require("../../middleware/utils");
const {
  emailExists,
  sendRegistrationEmailMessage,
} = require("../../middleware/emailer");
const { createItemInDb } = require("./helpers");
const Kyc = require("../../models/kyc");
const user = require("../../models/user");
const notification = require("../../models/notification");
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const verifyKyc = async (req, res) => {
  try {
    const data = await matchedData(req);
    // data.user_id = req.user._id
    // console.log(data._id, "asdf")
    const response = await Kyc.findOne({ _id: data._id });
    if (response) {
      // if (response.status == "0") {
      if (data.status == "1") {
        const upddate = await Kyc.findOneAndUpdate(
          { _id: data._id },
          { status: "1", reason: "" },
          async (err, did) => {
            if (err) {
              res.status(400).json({
                success: false,
                result: "",
                message: "Not Verified",
              });
            }
            if (did) {

              await user.findByIdAndUpdate(
                { _id: did.user_id },
                { kyc_verify: true },
                async (errs, dones) => {
                  if (errs) {
                    res.status(400).json({
                      success: false,
                      result: "",
                      message: "Not Verified",
                    });
                  }
                  if (dones) {
                    notification.create({
                        for:"kyc",
                        message:"Congrats !! your kyc approved successfully",
                        user_id:did.user_id,
                        status:"good"
                    },(reject,resolve) => {
                      if(reject){
                        res.status(400).json({
                          success: false,
                          result: "",
                          message: "kyc verified but notification didn't shown",
                          status:"bad"
                        });

                      }else{
                        res.status(200).json({
                          success: true,
                          result: response,
                          message: "Verified Successfully",
                        });

                      }
                    })
                  }
                }
              );
            }
          }   
        );
      } else {
        const refuse = await Kyc.findOneAndUpdate(
          { _id: data._id },
          { status: "2", reason: data.reason },
          async (err, done) => {
            if (err) {
              res.status(400).json({
                success: false,
                result: null,
                message: "KYC not verified",
              });
            }
            if (done) {
              await user.findByIdAndUpdate(
                { _id: done.user_id },
                { kyc_verify: false },
                async (errr, dones) => {
                  if (errr) {
                    res.status(400).json({
                      success: false,
                      result: null,
                      message: "KYC not verified",
                    });
                  }
                  if (dones) {


                    notification.create({
                      for:"kyc",
                      message:"Sorry !! your kyc submission rejected",
                      reason:data.reason,
                      user_id:done.user_id,
                  },(reject,resolve) => {
                    if(reject){
                      res.status(400).json({
                        success: false,
                        result: "",
                        message: "kyc verified but notification didn't shown",
                      });

                    }else{
                      res.status(200).json({
                        success: true,
                        result: response,
                        message: "Verified Successfully",
                      });
                    }
                  })
                  }
                }
              );
            }
          }
        );
      }
      // } else {
      //     res.status(400).json({
      //         success: false,
      //         result: null,
      //         message: "KYC Already Verified"
      //     })
      // }
    } else {
      res.status(400).json({
        success: false,
        result: null,
        message: "User Not found",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { verifyKyc };
