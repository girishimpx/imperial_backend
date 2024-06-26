const { handleError } = require('../../middleware/utils')
const dashboardImage = require('../../models/dashboardImage')

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getDashboardImagesAdmin = async (req, res) => {
  try {
    if(req.body.id){
        const resps = await dashboardImage.findOne({_id: req.body.id})
        if(resps){
            res.status(200).json({
                success: true,
                result: resps,
                message: "Successfully Fetched"
            });
        }else{
            res.status(200).json({
                success: false,
                result: '',
                message: "No Data Found"
            });
        }
    }else{
        const resps = await dashboardImage.find()
        if(resps?.length >0){
            res.status(200).json({
                success: true,
                result: resps,
                message: "Successfully Fetched"
            });
        }else{
            res.status(200).json({
                success: false,
                result: [],
                message: "No Data Found"
            });
        }
    }
    
} catch (error) {
    handleError(res, error)
  }
}

module.exports = { getDashboardImagesAdmin }
