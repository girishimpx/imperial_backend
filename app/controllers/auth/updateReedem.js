const USER = require('../../models/user')
const  mongoose  = require("mongoose");
const { handleError } = require('../../middleware/utils')

const updateReedem = async (req, res) => {
    try {

        const isApproved = await USER.findById(req.body._id)
        
        if(isApproved.iseligible == 'completed'){
        console.log(req.body,'REQUEST')
        var updateReedeme={}
        if(req.body.eligible){
             updateReedeme = {
                iseligible : 'Approved',
                redeem_points : req.body.redeempoints
            }
        }else if(req.body.redeempoints){
            updateReedeme = {
                redeem_points : req.body.redeempoints
            }
        }
        
        console.log(updateReedeme,'updateReedeme')
    const user = await USER.findOneAndUpdate({_id : mongoose.Types.ObjectId(req.body._id)},updateReedeme)
    const user1 = await USER.findById(req.body._id)

console.log('');
    if(true){
        res.status(200).json({
            success: true,
            result: 'TEST',
            message: 'Redeem Updated successfully'
        })
    }else{
        res.status(200).json({
            success: false,
            result: '',
            message: 'failed to approve'
        })
    }
} else {
    res.status(200).json({
        success: false,
        result: '',
        message: 'User Already approved For Redeem'
    })
}
    
    } catch (error) {
        handleError(res, error)
    }
};
module.exports = { updateReedem };
