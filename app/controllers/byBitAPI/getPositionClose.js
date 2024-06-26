const { handleError } = require('../../middleware/utils');
const trades = require('../../models/trade');


const getPositionClose = async (req, res) => {
    try {
        console.log('hello');
    const user = req.user;

    const positionHistory = await trades.find({ user_id : user._id, istpslclose : true });
   

    if (positionHistory.length > 0){

            res.status(200).json({
                success: true,
                result: positionHistory,
                message: `Position Details Found Successfully`,
            });

    } else {
            res.status(200).json({
                success: false,
                result: '',
                message: `Position Not Found`,
            });
    }



    } catch (error) {
        handleError(res, error)
    }
};
module.exports = { getPositionClose };
