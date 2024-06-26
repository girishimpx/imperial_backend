const { handleError } = require("../../middleware/utils");
const mongoose = require("mongoose");
const cpy = require("../../models/copytrade");
const subkey = require('../../models/copytrade')
const axios = require("axios");
const generator = require('generate-password');
const CryptoJS = require("crypto-js");

const setCollatralCoin = async (req, res, key) => {

  try {
    console.log('COLLATRAL A COIN');
    const USER = req.user;
    console.log(key,'ketdata');

    // const keyData = await cpy.findOne({ user_id: USER._id })
    // const keyData = {
    //     apikey : "AZIEKWTVtGs92FG9a5",
    //     secretkey : "KTYja4QaeU85Q58iz01arRZl7b6vv0ufND7W"
    // }

    const params = {
      coin: `${req.instId.slice(0, -4)}`,
      collateralSwitch: "ON"
    };

    const jsonParams = JSON.stringify(params);

    const endpoint = 'https://api.bybit.com/v5/account/set-collateral-switch';
    // const endpoint = 'https://api-demo.bybit.com/v5/account/set-collateral-switch';
    const apiKey = key.apikey;
    const apiSecret = key.secretkey;
    const recvWindow = 50000

    const timestamp = Date.now();
    const queryString = timestamp + apiKey + recvWindow + jsonParams
    const signature = CryptoJS.HmacSHA256(queryString, apiSecret).toString(CryptoJS.enc.Hex);

    const headers = {
      // "Host": "api-demo.bybit.com",
      "Host": "api.bybit.com",
      "X-BAPI-SIGN": signature,
      "X-BAPI-API-KEY": apiKey,
      "X-BAPI-TIMESTAMP": timestamp,
      "X-BAPI-RECV-WINDOW": recvWindow,
      'Content-Type': 'application/json',
    };

    return new Promise((resolve, reject) => {
      axios.post(endpoint, jsonParams, { headers })
        .then(async (response) => {
          console.log(jsonParams, 'PARAMS');
          if (response.data.retCode == 0) {
            console.log(response, 'API RESPONSE');
           
            const collatreldata = {
              success: true,
              result: "",
              message: "Coin SuccessFully Collatralled"
            }
            resolve(collatreldata);
          } else {
           
            const collatreldata = {
              success: false,
              result: "",
              message: response.data.retMsg
            }
            resolve(collatreldata);
          }
        })
    })
      .catch(error => {
        console.error('Error:', error.message);
        handleError(res, error)
      });




  } catch (error) {
    handleError(res, error);
  }
}

module.exports = { setCollatralCoin };
