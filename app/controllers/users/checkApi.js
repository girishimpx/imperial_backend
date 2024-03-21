const { matchedData } = require("express-validator");
const { handleError } = require("../../middleware/utils");
const User = require("../../models/user");
const wallet = require("../../models/wallet");
const CryptoJS = require("crypto-js");
const axios = require("axios");

const speakeasy = require("speakeasy");

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const checkApi = async (req, res) => {
  try {
    const loginUser = req.user;
    var domain = "https://www.imperialx.exchange";
    var apiKey = "622e4d02-dd52-428e-a8bf-357836b96628";
    var secretKey = "458015C86ECB5D0250389BB0DD299722";
    var passphrase = "Test@1530";
    var iosTime = new Date().toISOString();
    var method = "GET";
    var textToSign = "";
    textToSign += iosTime;
    textToSign += method;
    textToSign += "api/v5/asset/balances";

    var sign = CryptoJS.enc.Base64.stringify(
      CryptoJS.HmacSHA256(
        iosTime + "GET" + "/api/v5/asset/balances",
        "458015C86ECB5D0250389BB0DD299722"
      )
    );

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://www.imperialx.exchange/api/v5/asset/balances",
      headers: {
        "Content-Type": "application/json",
        "OK-ACCESS-KEY": "622e4d02-dd52-428e-a8bf-357836b96628",
        "OK-ACCESS-SIGN": sign,
        "OK-ACCESS-PASSPHRASE": "Test@1530",
        "OK-ACCESS-TIMESTAMP": iosTime,
        "TEXT-TO-SIGN": textToSign,
        Cookie: "locale=en-US",
      },
    };



    axios
      .request(config)
      .then(async (response) => {
        // res.json(response.data.data)
        let Balances = await response.data.data;
        if (Balances) {
          let walletaddress = await wallet
            .find({ user_id: loginUser._id })
            .populate("asset_id");
          if(walletaddress) {
            let  Eth ;
            let ETHWBalance ;

            
            for (let i = 0; i < Balances.length; i++) {
              for (let j = 0; j < walletaddress.length; j++) {
                let  Eths = "ETH" == walletaddress[j].asset_id.symbol ? Eth = walletaddress[j]._id : null 
                let ETHWBalancess = Balances[i].ccy == "ETHW" ? ETHWBalance = Balances[i] : null



                if (Balances[i].ccy == walletaddress[j].asset_id.symbol) {
                  wallet.findByIdAndUpdate({_id:walletaddress[j]._id},{balance:Balances[i].availBal,escrow_balance:Balances[i].frozenBal},(err,done)=>{
                    if(err){return console.log(err)}
                    if(done){return}       
                  })
                }
              }
              
            }
            wallet.findByIdAndUpdate({_id:Eth},{balance:ETHWBalance.availBal,escrow_balance:ETHWBalance.frozenBal},(errs,dones)=>{
              if(errs){return console.log(errs)}
                    if(dones){return res
                      .json({
                        success: true,
                        result: "",
                        message: "Balance updated successfully",
                      })
                      .status(200);}       
            })
          } else {
            res.status(400).json({
              success: false,
              result: "",
              message: "User Not Found",
            });
          }
        } else {
          res.status(400).json({
            success: false,
            result: "",
            message: "Balance Not Set",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { checkApi };
