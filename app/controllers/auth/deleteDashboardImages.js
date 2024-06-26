const { handleError } = require('../../middleware/utils')
const dashboardImage = require('../../models/dashboardImage')

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const deleteDashboardImages = async (req, res) => {
  try {
    if(req.body.id){
        const resps = await dashboardImage.findOne({_id: req.body.id})
        if(resps){
       await dashboardImage.deleteOne({_id: req.body.id})
            res.status(200).json({
                success: true,
                result: "",
                message: "Deleted Successfully"
            });
        }else{
            res.status(200).json({
                success: false,
                result: "",
                message: "Id Not Found"
            });
        }
           
        }else{
            res.status(200).json({
                success: false,
                result: '',
                message: "No Data Found"
            });
        }
} catch (error) {
    handleError(res, error)
  }
}

module.exports = { deleteDashboardImages }
