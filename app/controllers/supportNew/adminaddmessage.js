const { matchedData } = require("express-validator");
const Supportmodel = require("../../models/SUPPORT1");
const { handleError } = require("../../middleware/utils");
const Admin = require("../../models/admin");
const mongoose = require("mongoose");

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const AdminAddQuery = async (req, res) => {
  try {
    const admin = req.user;
    req = matchedData(req);
    const id_check = await  mongoose.Types.ObjectId.isValid(req.user_id)
    
if(id_check){

    const adminAndUSerExist = await Supportmodel.find({admin:admin._id,user_id:req.user_id})
    if(adminAndUSerExist.length > 0){
        Supportmodel.findOneAndUpdate(
            {
              user_id: req.user_id,
              admin:admin._id,
            },
            {
              $push: {Query:{
                author: "admin",
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


    }else{
        res.status(400).json({
            success: false,
            result: "",
            message: "You have no queries with this user",
          });
    }


}else{

    res.status(400).json({
        success: false,
        result: "",
        message: "Id malformed",
      });
}



  } catch (error) {
    handleError(res, error);
  }
};
module.exports = { AdminAddQuery };
