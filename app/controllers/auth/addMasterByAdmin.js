const { matchedData } = require('express-validator')

const { registerUser, setUserInfo, returnRegisterToken } = require('./helpers')
const { handleError } = require('../../middleware/utils')
const User = require('../../models/user')
const copytrade = require('../../models/copytrade')
const {imperialApiAxios}  = require('../../middleware/ImperialApi/imperialApi')
const asset = require("../../models/assets");

const {
    emailExists,
    sendRegistrationEmailMessage
} = require('../../middleware/emailer')

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const addMasterByAdmin = async (req, res) => {
    try {
        req = matchedData(req)
        const assets = await asset.find();
        const doesEmailExists = await User.find({ email: req.email })
        if (doesEmailExists.length > 0) {
            res.status(400).json({
                success: false,
                result: "",
                message: " Email Already Exist"
            })
        } else {
            const data = {
                email: req.email,
                password: req.password,
                kyc_verify: true,
                email_verify: true,
                trader_type: "master",
                name:req.name

            }
            User.create(data, async(err, done) => {
                if (done) {
                    const deta = {
                        apikey: req.api_key,
                        secretkey: req.secret_key,
                        api_name: req.api_name,
                        permission: req.permission,
                        exchange: req.exchange,
                        passphrase: req.passphrase,
                        user_id: done._id
                    } 


                    copytrade.create(deta, async(errs,dones) => {
                        if(dones){
                      

                            res.status(200).json({
                                success: true,
                                result: dones,
                                message: "Master Added Sucessfully"
                            })
                        }if(errs){
                            res.status(400).json({
                                success: false,
                                result: null,
                                message: "Master Added But Copy Trade Did Not Added"
                            })
                            

                        }

                    })


                } if (err) {
                    // console.log(err)
                    res.status(400).json({
                        success: false,
                        result: "",
                        message: "Master Did Not Created"
                    })


                }

            })



        }
    } catch (error) {
        handleError(res, error)
    }
}

module.exports = { addMasterByAdmin }
