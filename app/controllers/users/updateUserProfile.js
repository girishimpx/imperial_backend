const USER = require("../../models/user");


const updateUserProfile = async (req, res) => {
  
    const user = req.user

    const updateData = await USER.findOneAndUpdate({ _id : user._id }, {image : req.body.url})

    if(updateData){
        res.status(200).json({
            success: true,
            result: true,
            message: "Profile Updated Successfully",
          });
    } else {
        res.status(200).json({
            success: false,
            result: '',
            message: "Failed To Update Profile",
          });
    }


}

module.exports = { updateUserProfile }
