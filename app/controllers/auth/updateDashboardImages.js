const { handleError } = require('../../middleware/utils')
const dashboardImage = require('../../models/dashboardImage')

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateDashboardImages = async (req, res) => {
  try {
    var payload ={}

    if(req.body.image){
        payload.image = req.body.image
    }
    if(req.body.status){
        payload.status = req.body.status
    }
        const resps = await dashboardImage.findOneAndUpdate({_id: req.body.id}, payload)
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
} catch (error) {
    handleError(res, error)
  }
}

module.exports = { updateDashboardImages }
