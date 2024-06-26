const { handleError } = require("../../middleware/utils");
const mongoose = require("mongoose");
const subaccount = require("../../models/subaccount");
const subkey = require('../../models/copytrade')
const axios = require("axios");
const generator = require('generate-password');
const CryptoJS = require("crypto-js");

const createSubAcc = async (req, res) => {

    try {

      const USER = req.user;
        if(USER.email_verify == "true"){
          
        const isSubExist = await subaccount.findOne({ user_id : USER._id})

        if(isSubExist){
            res.status(200).json({
              success : false,
              result : '', 
              message : "Sub-Account Created Already",
              })
          }else{

            let unique = generator.generate({
              length: 16,
              numbers: true,
              uppercase: true,
          })
        const userId = req.user._id
        const name = req.body.name
        const user = req.user
        const params = {
            username: unique, 
            memberType: 1,
            switch: 1,
            isUta: true,
            note: name
          };
          
        const jsonParams = JSON.stringify(params);

        const endpoint = 'https://api.bybit.com/v5/user/create-sub-member';
        const apiKey = '0l0RFNXVkw0F0YfhDY';
        const apiSecret = 'vqw7hgSgKaB8sLPFal42zDj5cU9JQQsAx4Ei';
        const recvWindow = 50000
    
        const timestamp = Date.now();
        const queryString = timestamp + apiKey + recvWindow + jsonParams
        const signature = CryptoJS.HmacSHA256(queryString, apiSecret).toString(CryptoJS.enc.Hex);
        
        const headers = {
            "Host": "api.bybit.com",
            "X-BAPI-SIGN" : signature,
            "X-BAPI-API-KEY" : apiKey,
            "X-BAPI-TIMESTAMP" : timestamp,
            "X-BAPI-RECV-WINDOW" : recvWindow,
          'Content-Type': 'application/json',
        };  
        
        
        axios.post (endpoint, jsonParams ,{ headers })
          .then(async (response) => {
            // console.log('API Response Create-Sub:', response.data); 

            if(response.data.retCode == 0){

                const acc = {
                    user_id: userId,
                    label: response.data.result.username,
                    subAcct: name,
                    ts: response.data.time,
                    uid: response.data.result.uid,
                    acctLv: response.data.result.memberType
                }
                const account = await subaccount.create(acc);
                if(account){

                    const apiKeyData = {
                        subuid : account.uid,
                        note : name,
                        readOnly : 0,  
                        ips : "134.209.100.33,49.37.201.206",
                        permissions : {
                            ContractTrade : ["Order","Position"],
                            Spot : ["SpotTrade"],
                            Wallet: ["AccountTransfer"],
                            Options : ["OptionsTrade"],
                            Exchange : ["ExchangeHistory"],
                            CopyTrading : ["CopyTrading"]
                        }
                    }

                    const jsonapiKey = JSON.stringify(apiKeyData);

                    const endpoint = 'https://api.bybit.com/v5/user/create-sub-api';
                    const apiKey = '0l0RFNXVkw0F0YfhDY';
                    const apiSecret = 'vqw7hgSgKaB8sLPFal42zDj5cU9JQQsAx4Ei';
                    const recvWindow = 50000
                
                    const timestamp = Date.now();
                    const queryString = timestamp + apiKey + recvWindow + jsonapiKey
                    const signature = CryptoJS.HmacSHA256(queryString, apiSecret).toString(CryptoJS.enc.Hex);
                    
                    const headers = {
                        "Host": "api.bybit.com",
                        "X-BAPI-SIGN" : signature,
                        "X-BAPI-API-KEY" : apiKey,
                        "X-BAPI-TIMESTAMP" : timestamp,
                        "X-BAPI-RECV-WINDOW" : recvWindow,
                      'Content-Type': 'application/json',
                    };  
                    
                    
                    axios.post (endpoint, jsonapiKey ,{ headers })
                      .then(async (response) => {
                        // console.log('API Response API-KEY:', response.data);    
            
                        if(response.data.retCode == 0){

                            const sukey = await subkey.create({ 
                                user_id: userId,
                                apikey: response.data.result.apiKey,
                                secretkey: response.data.result.secret,
                                permission: "Read/write",
                                exchange: "bybit",
                                trade_base: {
                                    spot: true,
                                    margin: true,
                                    future: true
                                }   
                            })

                            if(sukey){
                                res.status(200).json({
                                    success : true,
                                    result : [], 
                                    message : "Api-Key Generated SuccessFully",
                                    })
                            } else {
                                res.status(200).json({
                                    success : false,
                                    result : [], 
                                    message : "Failed Generated Api-Key",
                                    })
                            }

                        }else{
                            res.status(200).json({
                                success : false,
                                result : [], 
                                message : response.data.retMsg,
                                })
                        }
                      })
                      .catch(error => {
                        console.error('Error:', error.message);
                        handleError(res, error)
                      });

                }else {
                     res.status(200).json({
                     success : false,
                     result : [], 
                     message : "Failed To Created SubAccount"
                    })
                }
               
            }else{
              console.log(params,'ACCOUNT**');
                res.status(200).json({
                    success : false,
                    result : "", 
                    message : response.data.retMsg,
                    })
            }
          })
          .catch(error => {
            console.error('Error:', error.message);
            handleError(res, error)
          });
        }
        }else{
          res.status(200).json({
            success : false,
            result : '', 
            message : "Please Verify Your Email-Id",
            })
        }
        

    } catch (error) {
        handleError(res, error);
    }
}

module.exports = { createSubAcc };
