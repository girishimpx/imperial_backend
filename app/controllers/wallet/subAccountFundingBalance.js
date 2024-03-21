const { handleError } = require('../../middleware/utils')
const wallet = require('../../models/wallet')
const axios = require("axios");
const CryptoJS = require("crypto-js");
const subAccounts = require('../../models/subaccount')


const subAccountFundingBalance = async(req,res) => {
    try {
console.log(req.user._id,"userid")
    const data = await subAccounts.findOne({user_id: req.user._id})
    const currency = ["BTC", "ETH", "LTC", "DOT", "FIL", "XRP", "ADA", "TRX", "BCH", "BSV", "EOS", "ETC", "LINK", "USDT"]
      
         
            var lens = 0  
        console.log(data?.subAcct,"Asdff")
        var type ;
        if(req.body.type === "funding"){
            type = 'asset'
        }else{
            type = 'account'
        }
            var domain = "https://www.okx.com";
            var apiKey = "f546a753-21b1-452b-b02a-05a6019e27a2";
            var secretKey = "F3F34BAAFE81DB29CE5FD38546C22ED9";
            var passphrase = "Impx@123";
            var iosTime = new Date().toISOString();
            var method = "GET";
            var textToSign = "";
            textToSign += iosTime;
            textToSign += method;
            textToSign += `/api/v5/${type}/subaccount/balances?subAcct=${data?.subAcct}&ccy=${req.body.ccy}`;
            // GET/api/v5/asset/subaccount/balances?subAcct=test1
            // GET /api/v5/account/subaccount/balances?subAcct=test1
         
            var sign = CryptoJS.enc.Base64.stringify(
                CryptoJS.HmacSHA256(
                    iosTime + "GET" + `/api/v5/${type}/subaccount/balances?subAcct=${data?.subAcct}&ccy=${req.body.ccy}`,
                    `${secretKey}`
                )
            );

            let config = {
                method: "GET",
                maxBodyLength: Infinity,
                url: `https://www.okx.com/api/v5/${type}/subaccount/balances?subAcct=${data?.subAcct}&ccy=${req.body.ccy}`,
                headers: {
                    "Content-Type": "application/json",
                    "OK-ACCESS-KEY": apiKey,
                    "OK-ACCESS-SIGN": sign,
                    "OK-ACCESS-PASSPHRASE": passphrase,
                    "OK-ACCESS-TIMESTAMP": iosTime,
                    "TEXT-TO-SIGN": textToSign,
                    Cookie: "locale=en-US",
                },

            }

            await axios
            .request(config)
            .then(async (ress,error) => {
                console.log(ress.data, "data")
                if (ress.data.code === "0") {
                    
                    if (ress.data.data?.length > 0) {
                        const bal = ress.data.data[0]?.details
                        // console.log("🚀 ~ .then ~ bal:", bal.length)
                        res.status(200).json({
                            success: true,
                            result: ress.data.data[0],
                            message: "Wallet created successfully",
                          });

                        // if (bal.length > 0) {
                        //     for (let i = 0; i < bal.length; i++) {
                        //         const element = bal[i];
                        //         console.log(element.availEq, element1?.user_id, element?.ccy, "ele")
                        //         await wallet.findOneAndUpdate({ user_id: element1?.user_id, symbol: element?.ccy }, { balance: element?.cashBal, escrow_balance: element?.frozenBal })
                        //         const update = await wallet.findOneAndUpdate({ user_id: element1?.user_id, symbol: element?.ccy }, { margin_loan: element?.availEq })
                        //         console.log("🚀 ~  .then ~ update:", update)
                        //     }
                        // } else {
                        //     for (let j = 0; j < currency.length > 0; j++) {
                        //         const curenc = currency[j]
                        //         console.log(curenc, "currav111")
                        //         await wallet.findOneAndUpdate({ user_id: element1?.user_id, symbol: curenc?.currency }, { balance: 0, escrow_balance: 0 })

                        //     }
                        // }


                    } else {
                        console.log(error, "error")

                    }
                } else {
                    console.log(error, "error")

                }
            })



   
   
   

    } catch (error) {
        handleError(res,error)
    }
}

module.exports = {subAccountFundingBalance}