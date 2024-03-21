const { getItems } = require('../../middleware/db/getItems')
const wallet = require('../../models/wallet')
const { handleError } = require('../../middleware/utils')
const axios = require("axios");
const CryptoJS = require("crypto-js");
const subAccounts = require('../../models/subaccount')
const depositeAddress = require('../../models/depositeAddress')
const copytrades = require('../../models/copytrade')
const internaltransfer = require('../../models/internalTransfer')

// const wallet = require('../../models/wallet')


const transferFunds = async (req, res) => {
    try {


        const datas = await copytrades.findOne({ user_id: req?.user?._id })
        console.log("🚀 ~ file: transferFunds.js:18 ~ transferFunds ~ datas:", datas)
        if (datas) {
            let data = JSON.stringify({
                "amt": req.body.Amount,
                "ccy": req.body.Currency,
                "from": req.body.from,
                "to": req.body.to
            });
            var domain = "https://www.okx.com";
            var apiKey = datas?.apikey;
            var secretKey = datas?.secretkey;
            var passphrase = datas?.passphrase;
            var iosTime = new Date().toISOString();
            var method = "POST";
            var textToSign = "";
            textToSign += iosTime;
            textToSign += method;
            textToSign += `/api/v5/asset/transfer`;

            var sign = CryptoJS.enc.Base64.stringify(
                CryptoJS.HmacSHA256(
                    iosTime + "POST" + `/api/v5/asset/transfer${data}`,
                    `${secretKey}`
                )
            );

            let config = {
                method: "POST",
                maxBodyLength: Infinity,
                url: `https://www.okx.com/api/v5/asset/transfer`,
                headers: {
                    "Content-Type": "application/json",
                    "OK-ACCESS-KEY": apiKey,
                    "OK-ACCESS-SIGN": sign,
                    "OK-ACCESS-PASSPHRASE": passphrase,
                    "OK-ACCESS-TIMESTAMP": iosTime,
                    "TEXT-TO-SIGN": textToSign,
                    Cookie: "locale=en-US",
                },
                data: data
            }

            await axios
                .request(config)
                .then(async (ress) => {
                    console.log(ress.data, "data")
                    if (ress.data.code === "0") {
                        if (ress.data.data?.length > 0) {
                            var payload = {
                                user_id: req.user._id,
                                Amount: req.body.Amount,
                                Currency: req.body.Currency,
                                from: req.body.from == "18" ? "Trading" : "Funding",
                                to: req.body.to == "18" ? "Trading" : "Funding"
                            }
                            await internaltransfer.create(payload)
                            res.status(200).json({
                                success: true,
                                result: ress.data.data,
                                message: "Transfer Successfully"
                            })
                        }
                    }
                    else {
                        res.status(200).json({
                            success: false,
                            result: null,
                            message: ress.data.msg
                        })
                    }
                })
        } else {
            res.status(400).json({
                success: false,
                result: null,
                message: "Account Not Found"
            })
        }

    } catch (error) {
        // handleError(res, error)
        console.log(error, "err")
    }
}
module.exports = { transferFunds }