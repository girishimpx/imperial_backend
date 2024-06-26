const { handleError } = require('../../middleware/utils')
const dashboardImage = require('../../models/dashboardImage')

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const addDashboardImages = async (req, res) => {
    try {
        const data = req.body
        if(data.name){
            if(data.image){
                var resps = await dashboardImage.create(data)
                if(resps){
                    res.status(200).json({
                        success: true,
                        result: resps,
                        message: "Uploaded Successfully"
                    })  
                }else{
                    res.status(200).json({
                        success: false,
                        result: null,
                        message: "something went wrong"
                    })   
                }
            }else{
                res.status(200).json({
                    success: false,
                    result: null,
                    message: "Please Enter Image"
                })  
            }
        }else{
            res.status(200).json({
                success: false,
                result: null,
                message: "Please Enter Name"
            })
        }
        
    } catch (error) {
        handleError(res, error)
    }
}

module.exports = { addDashboardImages }
