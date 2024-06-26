const { handleError } = require("../../middleware/utils");
const mongoose = require("mongoose");
const subaccount = require("../../models/subaccount");
const subkey = require('../../models/copytrade')
const axios = require("axios");
const generator = require('generate-password');
const CryptoJS = require("crypto-js");

const addDemoFund = async (req, res) => {

    try {
        console.log('*******************');
        const params = {
            utaDemoApplyMoney: [
                {
                    coin: "USDT",
                    amountStr: "100000"
                },
              
            ]
          };

        // const client = new RestClientV5({
        //     key: 'AZIEKWTVtGs92FG9a5',
        //     secret: 'KTYja4QaeU85Q58iz01arRZl7b6vv0ufND7W',
        //     demoTrading: true
        // },);
          
        const jsonParams = JSON.stringify(params);

        const endpoint = 'https://api-demo.bybit.com/v5/account/demo-apply-money';
        const apiKey = 'AZIEKWTVtGs92FG9a5';
        const apiSecret = 'KTYja4QaeU85Q58iz01arRZl7b6vv0ufND7W';
        const recvWindow = 50000
    
        const timestamp = Date.now();
        const queryString = timestamp + apiKey + recvWindow + jsonParams
        const signature = CryptoJS.HmacSHA256(queryString, apiSecret).toString(CryptoJS.enc.Hex);
        
        const headers = {
            "Host": "api-demo.bybit.com",
            "X-BAPI-SIGN" : signature,
            "X-BAPI-API-KEY" : apiKey,
            "X-BAPI-TIMESTAMP" : timestamp,
            "X-BAPI-RECV-WINDOW" : recvWindow,
          'Content-Type': 'application/json',
        };  
        
        
        axios.post (endpoint, jsonParams ,{ headers })
          .then(async (response) => {
            console.log('API Response Create-Sub:', response); 

            if(response.data.retCode == 0){
                console.log(response,'*******************');
                res.status(200).json({
                    success: true,
                    result: response.data.result.utaDemoApplyMoneyConfig,
                    message: "Demo Fund AddedSuccessfully",
                  })
               
            } else {
                console.log('API Response Create-Sub:', response); 
                res.status(200).json({
                    success: false,
                    result: "",
                    message: response.data.retMsg,
                  })
            }
          })
          .catch(error => {
            console.error('Error:', error.message);
            handleError(res, error)
          });
        
        
        

    } catch (error) {
        handleError(res, error);
    }
}

module.exports = { addDemoFund };
