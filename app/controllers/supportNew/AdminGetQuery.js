const { matchedData } = require('express-validator')
const { handleError } = require('../../middleware/utils')
const Supportmodel = require('../../models/SUPPORT1')
const mongoose = require('mongoose')




/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const AdmingetQuery = async (req, res) => {
  try {
    admin = req.user
    req = matchedData(req)
    
    const id_check = mongoose.Types.ObjectId.isValid(req.user_id)

if(id_check){
    const querylist = await Supportmodel.find({admin:admin._id,user_id:req.user_id}).populate("user_id");
if(querylist.length > 0){

    res.status(200).json({
        success: true,
        result: querylist,
        message: "Query fetched successfully",
      });

}else{
    res.status(400).json({
        success: false,
        result: "",
        message: "You have no query with this user",
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
    handleError(res, error)
  }
}

module.exports = { AdmingetQuery }
