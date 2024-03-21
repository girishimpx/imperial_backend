const { getItems } = require('../../middleware/db/getItems')
const wallet = require('../../models/wallet')
const { handleError } = require('../../middleware/utils')
const axios = require("axios");
const CryptoJS = require("crypto-js");
const subAccounts = require('../../models/subaccount')
const depositeAddress = require('../../models/depositeAddress')


const createDepositeAddress = async (req, res) => {
    try {
        console.log(req.user._id, "userid")
        const data = await subAccounts.findOne({ user_id: req.user._id })
        if (data) {
            const datas = [
                {
                    "ccy": "USDT",
                    "chain": "USDT-Polygon"
                },
                {
                    "ccy": "USDT",
                    "chain": "USDT-ERC20"
                },
                {
                    "ccy": "USDT",
                    "chain": "USDT-TRC20"
                },
                {
                    "ccy": "EOS",
                    "chain": "EOS-EOS"
                },
                {
                    "ccy": "BCH",
                    "chain": "BCH-BitcoinCash"
                },
                {
                    "ccy": "BCH",
                    "chain": "BCHK-OKTC"
                },
                {
                    "ccy": "ETH",
                    "chain": "ETH-ERC20"
                },
                {
                    "ccy": "ETH",
                    "chain": "ETHK-OKTC"
                },
                {
                    "ccy": "BTC",
                    "chain": "BTC-Bitcoin"
                },
                {
                    "ccy": "BTC",
                    "chain": "BTCK-OKTC"
                },
                {
                    "ccy": "ADA",
                    "chain": "ADA-Cardano"
                },
                {
                    "ccy": "BSV",
                    "chain": "BSV-Bitcoin SV"
                },
                {
                    "ccy": "ETC",
                    "chain": "ETC-Ethereum Classic"
                },
                {
                    "ccy": "ETC",
                    "chain": "ETCK-OKTC"
                },
                {
                    "ccy": "LTC",
                    "chain": "LTC-Litecoin"
                },
                {
                    "ccy": "LTC",
                    "chain": "LTCK-OKTC"
                },
                {
                    "ccy": "TRX",
                    "chain": "TRX-TRC20"
                },
                {
                    "ccy": "TRX",
                    "chain": "TRXK-OKTC"
                },
                {
                    "ccy": "XRP",
                    "chain": "XRP-Ripple"
                },
                {
                    "ccy": "XRP",
                    "chain": "XRPK-OKTC"
                },
                {
                    "ccy": "DOT",
                    "chain": "DOT-Polkadot"
                },
                {
                    "ccy": "DOT",
                    "chain": "DOTK-OKTC"
                },
                {
                    "ccy": "LINK",
                    "chain": "LINK-ERC20"
                },
                {
                    "ccy": "LINK",
                    "chain": "LINKK-OKTC"
                },
                {
                    "ccy": "FIL",
                    "chain": "FIL-Filecoin"
                },
                {
                    "ccy": "FIL",
                    "chain": "FILK-OKTC"
                }


            ]
            const len = datas.length
            console.log("🚀 ~ file: createDepositeAddress.js:123 ~ createDepositeAddress ~ len:", len)
            var lens = 0
            for (let i = 0; i < len; i++) {
                const element = datas[i];
                const addresss = await depositeAddress.findOne({ user_id: req.user._id, ccy: element?.ccy, chain: element?.chain, subAcct: data?.subAcct })
                if (addresss) {
                    lens++
                } else {

                    let data1 = JSON.stringify({
                        "ccy": element?.ccy,
                        "subAcct": data?.subAcct,
                        "chain": element?.chain
                    });

                    var domain = "https://www.okx.com";
                    var apiKey = 'f546a753-21b1-452b-b02a-05a6019e27a2';
                    var secretKey = 'F3F34BAAFE81DB29CE5FD38546C22ED9';
                    var passphrase = 'Impx@123';
                    var iosTime = new Date().toISOString();
                    var method = "POST";
                    var textToSign = "";
                    textToSign += iosTime;
                    textToSign += method;
                    textToSign += `/api/v5/asset/broker/nd/subaccount-deposit-address${data1}`;

                    var sign = CryptoJS.enc.Base64.stringify(
                        CryptoJS.HmacSHA256(
                            iosTime + "POST" + `/api/v5/asset/broker/nd/subaccount-deposit-address${data1}`,
                            `${secretKey}`
                        )
                    );

                    let config = {
                        method: "post",
                        maxBodyLength: Infinity,
                        url: `https://www.okx.com/api/v5/asset/broker/nd/subaccount-deposit-address`,
                        headers: {
                            "Content-Type": "application/json",
                            "OK-ACCESS-KEY": apiKey,
                            "OK-ACCESS-SIGN": sign,
                            "OK-ACCESS-PASSPHRASE": passphrase,
                            "OK-ACCESS-TIMESTAMP": iosTime,
                            "TEXT-TO-SIGN": textToSign,
                            Cookie: "locale=en-US",
                        },
                        data: data1,
                    }

                    await axios
                        .request(config)
                        .then(async (ress) => {
                            if (ress.data.code === "0") {
                                console.log(ress.data.data[0], "data1");
                                var dts = ress.data.data[0]
                                var payload = {
                                    ccy: dts?.ccy,
                                    chain: dts?.chain,
                                    subAcct: data?.subAcct,
                                    addr: dts?.addr,
                                    user_id: req.user._id
                                }
                                await depositeAddress.create(payload)
                                lens++
                            } else {
                                res.status(200).json({
                                    success: false,
                                    result: "",
                                    message: "Suc-account Creation failed"
                                });
                            }
                        })
                }

            }


            if (lens === len) {
                res.status(200).json({
                    success: true,
                    result: data,
                    message: 'Wallet found succesfully'
                })
            } else {
                res.status(200).json({
                    success: false,
                    result: null,
                    message: 'SomeThing Went Wrong'
                })
            }



        } else {
            res.status(200).json({
                success: false,
                result: null,
                message: 'Sub Account Not Found'
            })

        }

    } catch (error) {
        handleError(res, error)
    }
}
module.exports = { createDepositeAddress }