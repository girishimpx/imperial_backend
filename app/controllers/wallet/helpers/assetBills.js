const { getItems } = require('../../../middleware/db/getItems')
const wallet = require('../../../models/wallet')
const { handleError } = require('../../../middleware/utils')
const axios = require("axios");
const CryptoJS = require("crypto-js");
const subAccounts = require('../../../models/subaccount')
const depositeAddress = require('../../../models/depositeAddress')
const copytrade = require('../../../models/copytrade');
const USERS = require('../../../models/user')
const { imperialApiAxios } = require('../../../middleware/ImperialApi/imperialApi')


/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const assetBills = async (req) => {
  try {
   
        const user = req
        const traderKey = await copytrade.findOne({user_id : user})

        if(traderKey){

            const response = await imperialApiAxios(
                "get",
            "https://www.okx.com/api/v5/asset/bills",
            `/api/v5/asset/bills`,
            {},
            traderKey.apikey,
            traderKey.secretkey,
            traderKey.passphrase,
            )

            if(response.data.length > 0){
            var filteredResponse = []; 
            for(var i = 0; i < response.data.length; i++) {
                var element = response.data[i];

                if(element.type == '1' || element.type == '23'){
                    filteredResponse.push(element)
                }
            }

            if(filteredResponse.length > 0){

            // Function to find the minimum timestamp
            function findMinTimestamp(data) {
                let minTimestamp = data[0];

                for (const entry of data) {
                    const timestamp = entry;

                    if (timestamp.ts < minTimestamp.ts) {
                        minTimestamp = timestamp;
                    }
                }

                return minTimestamp;
            }

            // Call the function
            const minTimestamp = findMinTimestamp(filteredResponse);

            // console.log('Minimum timestamp:',minTimestamp);


            return [minTimestamp];
            
            }else{
            return [];
            }
        }else{
            return [];
        }
        }else{
            return [];
        }

} catch (error) {
    return error
  }
}

module.exports = { assetBills }


