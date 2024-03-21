const { matchedData } = require('express-validator')
const { handleError } = require('../../middleware/utils')
const Supportmodel = require('../../models/SUPPORT1')

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getQuery = async (req, res) => {
  try {
    user = req.user
    const querylist = await Supportmodel.find({user_id:user._id})

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
        message: "Query not found",
      });
}


  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getQuery }
