const { getItems } = require('../../middleware/db/getItems')
const wallet = require('../../models/wallet')
const { handleError } = require('../../middleware/utils')
const axios = require("axios");
const CryptoJS = require("crypto-js");
const subAccounts = require('../../models/subaccount')
const depositeAddress = require('../../models/depositeAddress')
const copytrade = require('../../models/copytrade');
const USERS = require('../../models/user')
const { imperialApiAxios } = require('../../middleware/ImperialApi/imperialApi')


/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getDepositHistory = async (req, res) => {
  try {
   
        const user = req.user
        const traderKey = await copytrade.findOne({user_id : user._id})

        if(traderKey){

            const response = await imperialApiAxios(
                "get",
            "https://www.okx.com/api/v5/asset/deposit-history",
            `/api/v5/asset/deposit-history`,
            {},
            traderKey.apikey,
            traderKey.secretkey,
            traderKey.passphrase,
            )
            // console.log(response,'*******************');
            res.status(200).json({
                success: true,
                result: response,
                message: "User Deposits Found Successfully"
            });
        }else{
            res.status(200).json({
                success: false,
                result: [],
                message: "User Not Found"
            });
        }

  





} catch (error) {
    handleError(res, error)
  }
}

module.exports = { getDepositHistory }
