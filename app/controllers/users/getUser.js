const User = require('../../models/user')
const masterRating = require('../../models/Rating')
const { matchedData } = require('express-validator')
const { isIDGood, handleError } = require('../../middleware/utils')
const { getItemById } = require('../../middleware/db')

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getUser = async (req, res) => {
  try {
    const userId = req.user._id
    req = matchedData(req)
    console.log(req,req.id)
    let isRated = false
    const id = await isIDGood(req.id)
    // res.status(200).json(await getItemById(id, User))
    const user =await User.findById(req.id)
    const masterRate = await masterRating.findOne({$and:[{'user_id._id': userId},{master_id:req.id}]})
    //console.log(masterRate)
    if(masterRate){
      isRated = true
    }
    else{
      isRated = false
    }
    if (user){
      res.status(200).json({
        success: true,
        result: user,isRated,
        message: "Data Found successfully",
      });
    }
    
   else {
    res.status(400).json({
      success: false,
      result: "",
      message: "Data Not Found ",
    });
  } 
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getUser }
