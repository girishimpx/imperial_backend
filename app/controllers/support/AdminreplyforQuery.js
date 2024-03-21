const { matchedData } = require("express-validator");
const Supportmodel = require("../../models/Adminreply");
const query = require("../../models/support");
const { handleError } = require("../../middleware/utils");
const mongoose = require('mongoose')


/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const ReplyForQuery = async (req, res) => {
  try {
    const user = req.user;
    req = matchedData(req);
    const id_check = mongoose.Types.ObjectId.isValid(req.queryId)
    
    if(id_check){

      Supportmodel.create(
        {
          Question:req.queryId,
          Reply:req.reply
        },
        (err, done) => {
          if (err) {
            res.status(400).json({
              success: false,
              result: "",
              message: "Reply did not sent",
            });
          } else {
            query.findByIdAndUpdate({_id:req.queryId},{$push:{Answer:done._id}},(errs,did)=>{


              if(errs){
                res.status(400).json({
                  success: false,
                  result: "",
                  message: "Replied successfully but not stored for corresponding place ",
                });
              }else{
                res.status(200).json({
                  success: true,
                  result: "",
                  message: "Replied successfully ",
                });
              }

            })
          }
        }
      );

    }else{
      res.status(400).json({
        success: false,
        result: "",
        message: "Id Malformed",
      });
    }
    
  } catch (error) {
    handleError(res, error);
  }
};
module.exports = { ReplyForQuery };
