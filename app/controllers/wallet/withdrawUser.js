const { getItems } = require('../../middleware/db/getItems')
const wallet = require('../../models/wallet')
const { handleError } = require('../../middleware/utils')
const axios = require("axios");
const CryptoJS = require("crypto-js");
const subAccounts = require('../../models/subaccount')
const depositeAddress = require('../../models/depositeAddress')
const copytrades = require('../../models/copytrade')

// const wallet = require('../../models/wallet')


const withdrawUser = async (req, res) => {
    try {

        let data = JSON.stringify({
            "amt": req.body.Amount,
            "fee": req.body.Fee,
            "dest": req.body.Dest,
            "ccy": req.body.Currency,
            "chain": req.body.Chain,
            "areaCode": "86",
            "toAddr": req.body.Address
        });
        var domain = "https://www.okx.com";
        var apiKey = "f546a753-21b1-452b-b02a-05a6019e27a2";
        var secretKey = "F3F34BAAFE81DB29CE5FD38546C22ED9";
        var passphrase = "Impx@123";
        var iosTime = new Date().toISOString();
        var method = "POST";
        var textToSign = "";
        textToSign += iosTime;
        textToSign += method;
        textToSign += `/api/v5/asset/withdrawal`;

        var sign = CryptoJS.enc.Base64.stringify(
            CryptoJS.HmacSHA256(
                iosTime + "POST" + `/api/v5/asset/withdrawal${data}`,
                `${secretKey}`
            )
        );

        let config = {
            method: "POST",
            maxBodyLength: Infinity,
            url: `https://www.okx.com/api/v5/asset/withdrawal`,
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
                        res.status(200).json({
                            success: true,
                            result: ress.data.data,
                            message: "WithDraw Successfully"
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
    } catch (error) {
        // handleError(res, error)
        console.log(error, "err")
    }
}
module.exports = { withdrawUser }