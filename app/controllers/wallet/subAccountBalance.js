const { getItems } = require('../../middleware/db/getItems')
const wallet = require('../../models/wallet')
const { handleError } = require('../../middleware/utils')
const axios = require("axios");
const CryptoJS = require("crypto-js");
const subAccounts = require('../../models/subaccount')
const depositeAddress = require('../../models/depositeAddress')
const copytrades = require('../../models/copytrade')

// const wallet = require('../../models/wallet')


const subAccountBalance = async (res) => {
    try {
        const data = await subAccounts.find({})
        const currency = ["BTC", "ETH", "LTC", "DOT", "FIL", "XRP", "ADA", "TRX", "BCH", "BSV", "EOS", "ETC", "LINK", "USDT"]
        if (data?.length > 0) {
            for (let i = 0; i < data.length; i++) {
                const element1 = data[i];
                var lens = 0

                var domain = "https://www.okx.com";
                var apiKey = "f546a753-21b1-452b-b02a-05a6019e27a2";
                var secretKey = "F3F34BAAFE81DB29CE5FD38546C22ED9";
                var passphrase = "Impx@123";
                var iosTime = new Date().toISOString();
                var method = "GET";
                var textToSign = "";
                textToSign += iosTime;
                textToSign += method;
                textToSign += `/api/v5/account/subaccount/balances?subAcct=${element1?.subAcct}`;

                var sign = CryptoJS.enc.Base64.stringify(
                    CryptoJS.HmacSHA256(
                        iosTime + "GET" + `/api/v5/account/subaccount/balances?subAcct=${element1?.subAcct}`,
                        `${secretKey}`
                    )
                );

                let config = {
                    method: "GET",
                    maxBodyLength: Infinity,
                    url: `https://www.okx.com/api/v5/account/subaccount/balances?subAcct=${element1?.subAcct}`,
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
                    .then(async (ress) => {
                        // console.log(ress.data, "data")
                        if (ress.data.code === "0") {

                            if (ress.data.data?.length > 0) {
                                const bal = ress.data.data[0]?.details
                                // console.log("🚀 ~ file: subAccountBalance.js:63 ~ .then ~ bal:", bal.length)

                                if (bal.length > 0) {
                                    for (let i = 0; i < bal.length; i++) {
                                        const element = bal[i];
                                        // console.log(element.availEq, element1?.user_id, element?.ccy, "ele")
                                        await wallet.findOneAndUpdate({ user_id: element1?.user_id, symbol: element?.ccy }, { balance: element?.cashBal, escrow_balance: element?.frozenBal })
                                        const update = await wallet.findOneAndUpdate({ user_id: element1?.user_id, symbol: element?.ccy }, { margin_loan: element?.availEq })
                                        // console.log("🚀 ~ file: subAccountBalance.js:72 ~ .then ~ update:", update)
                                    }
                                } else {
                                    for (let j = 0; j < currency.length > 0; j++) {
                                        const curenc = currency[j]
                                        // console.log(curenc, "currav")
                                        await wallet.findOneAndUpdate({ user_id: element1?.user_id, symbol: curenc?.currency }, { balance: 0, escrow_balance: 0 })

                                    }
                                }


                            } else {
                                // console.log(error, "error")

                            }
                        } else {
                            // console.log(error, "error")

                        }
                    })
            }



        }
        else {


        }

    } catch (error) {
        // handleError(res, error)
        // console.log(error, "err")
    }
}
module.exports = { subAccountBalance }