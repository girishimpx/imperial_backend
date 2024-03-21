const wallet = require("../../models/wallet");
const asset = require("../../models/assets");
const user = require("../../models/user");
const { createItem } = require("../../middleware/db/createItem");
const { handleError, isIDGood } = require("../../middleware/utils");
const { matchedData } = require("express-validator");
const { response } = require("../../middleware/response/response");
const axios = require("axios");
const CryptoJS = require("crypto-js");

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const createWallet = async (req, res) => {
  try {
    req = matchedData(req);
    const assets = await asset.find();

    if (assets.length > 0) {
      for (let i = 0; i < assets.length; i++) {
        const existinguser = await wallet.find({
          user_id: req.user_id,
          asset_id: assets[i]._id,
        });

        if (existinguser.length === 0) {


          var domain = "https://www.okx.com";
          var apiKey = "f546a753-21b1-452b-b02a-05a6019e27a2";
          var secretKey = "F3F34BAAFE81DB29CE5FD38546C22ED9";
          var passphrase = "Impx@123";
          // var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
          // var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
          // var passphrase = "Pass@123";
          var iosTime = new Date().toISOString();
          var method = "GET";
          var textToSign = "";
          textToSign += iosTime;
          textToSign += method;
          textToSign += "api/v5/asset/balances";

          var sign = CryptoJS.enc.Base64.stringify(
            CryptoJS.HmacSHA256(
              iosTime +
              "GET" +
              `/api/v5/asset/deposit-address?ccy=${assets[i].symbol}&=`,
              secretKey
            )
          );

          let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `https://www.okx.com/api/v5/asset/deposit-address?ccy=${assets[i].symbol}&=`,
            headers: {
              "Content-Type": "application/json",
              "x-simulated-trading": 0,
              "OK-ACCESS-KEY": apiKey,
              "OK-ACCESS-SIGN": sign,
              "OK-ACCESS-PASSPHRASE": passphrase,
              "OK-ACCESS-TIMESTAMP": iosTime,
              "TEXT-TO-SIGN": textToSign,
              Cookie: "locale=en-US",
            },
          };

          await axios
            .request(config)
            .then(async (response) => {

              req.asset_id = assets[i]._id;
              req.balance = 0;
              req.escrow_balance = 0;
              req.mugavari = response.data.data;
              req.symbol = assets[i].symbol;
              wallet.create(req);

              if (assets.length == i + 1) {
                // user.findByIdAndUpdate({_id:req.user_id},{trader_type:"master"},(err,done)=>{
                //   if(err){
                //     res.status(400).json({
                //       success: false,
                //       result: null,
                //       message: "Wallet created but not change the user to master",
                //     });    
                //   }else{
                //     res.status(200).json({
                //       success: true,
                //       result: null,
                //       message: "Wallet created successfully",
                //     });
                //   }
                // })
                res.status(200).json({
                  success: true,
                  result: null,
                  message: "Wallet created successfully",
                });
              }
            })
            .catch((error) => {
              console.log(error, "error")
              res.status(400).json({
                success: false,
                result: error,
                message: "Some Assets not added",
              });
            });
        } else if (existinguser.length > 0) {
          res.status(400).json({
            success: false,
            result: null,
            message: "Wallet already exist for the user",
          });
        }
      }
    } else {
      res.status(400).json({
        success: false,
        result: null,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};
module.exports = { createWallet };
