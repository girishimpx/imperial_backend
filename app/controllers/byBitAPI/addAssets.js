const { handleError } = require("../../middleware/utils");
const mongoose = require("mongoose");
const ASSETS = require("../../models/assets");
const axios = require("axios");
const CryptoJS = require("crypto-js");

const addAssets = async (req, res) => {

    try {
    
        const params = {
            coin: 'BTC', 
          };

        const endpoint = 'https://api.bybit.com/v5/asset/coin/query-info';
        const apiKey = '0l0RFNXVkw0F0YfhDY';
        const apiSecret = 'vqw7hgSgKaB8sLPFal42zDj5cU9JQQsAx4Ei';
        const recvWindow = 50000
    
        const timestamp = Date.now();
        const queryString = timestamp + apiKey + recvWindow
        const signature = CryptoJS.HmacSHA256(queryString, apiSecret).toString(CryptoJS.enc.Hex);
        
        const headers = {
            "Host": "api.bybit.com",
            "X-BAPI-SIGN" : signature,
            "X-BAPI-API-KEY" : apiKey,
            "X-BAPI-TIMESTAMP" : timestamp,
            "X-BAPI-RECV-WINDOW" : recvWindow,
          'Content-Type': 'application/json',
        };
        
        
        axios.get (endpoint, { headers })
          .then(async (response) => {
            console.log('API Response:', response.data);    

            if(response.data.retCode == 0){
               
                var assertData = response.data.result.rows
                for(var i = 0; i < assertData.length; i++){
                    var assets = {
                        coinname : assertData[i].name,
                        chain : assertData[i].chains[0].chainType,
                        symbol : assertData[i].chains[0].chain,
                    }

                    await ASSETS.create(assets)
                }

                 res.status(200).json({
                     success : true,
                     data : response.data.result.rows, 
                     message : "Assets Added SuccessFully"
                    })

            }else{
                res.status(200).json({
                    success : false,
                    data : [], 
                    message : response.data.retMsg,
                    })
            }
          })
          .catch(error => {
            console.error('Error:', error.message);
          });
        

    } catch (error) {
        handleError(res, error);
    }
}

module.exports = { addAssets };
