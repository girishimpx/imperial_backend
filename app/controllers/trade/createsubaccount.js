const trade = require("../../models/trade");
const { handleError } = require("../../middleware/utils");
const { matchedData } = require("express-validator");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const subaccount = require("../../models/subaccount");
const subkey = require('../../models/copytrade')
// const ASSETS = require("../../models/assets");
// const copytrade = require("../../models/copytrade");
// const { imperialApiAxios } = require('../../middleware/ImperialApi/imperialApi')
const generator = require('generate-password');
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createsubaccount = async (req, res) => {
    try {
        const user = req.user;
        req = matchedData(req);

        if (user.email_verify === "true") {

            const avai = await subaccount.findOne({ user_id: user._id })
            const apch = await subkey.findOne({ user_id: user._id })
            if (avai) {
                res.status(200).json({
                    success: false,
                    result: "",
                    message: "Sub-account Already Created"
                });
            } else if (apch) {
                res.status(200).json({
                    success: false,
                    result: "",
                    message: "Api-key Already Created"
                });
            }
            else {
                let name = generator.generate({
                    length: 10,
                    numbers: true,
                    uppercase: true
                })

                let data = JSON.stringify({
                    subAcct: name,
                    label: name
                });

                var domain = "https://www.imperialx.exchange";
                var apiKey = 'f546a753-21b1-452b-b02a-05a6019e27a2';
                var secretKey = 'F3F34BAAFE81DB29CE5FD38546C22ED9';
                var passphrase = 'Impx@123';
                var iosTime = new Date().toISOString();
                var method = "POST";
                var textToSign = "";
                textToSign += iosTime;
                textToSign += method;
                textToSign += `/api/v5/broker/nd/create-subaccount${data}`;
                console.log(data, "account name");

                var sign = CryptoJS.enc.Base64.stringify(
                    CryptoJS.HmacSHA256(
                        iosTime + "POST" + `/api/v5/broker/nd/create-subaccount${data}`,
                        `${secretKey}`
                    )
                );
                console.log(sign, "sigb1");
                let config = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: `https://www.okx.com/api/v5/broker/nd/create-subaccount`,
                    headers: {
                        "Content-Type": "application/json",
                        "OK-ACCESS-KEY": apiKey,
                        "OK-ACCESS-SIGN": sign,
                        "OK-ACCESS-PASSPHRASE": passphrase,
                        "OK-ACCESS-TIMESTAMP": iosTime,
                        "TEXT-TO-SIGN": textToSign,
                        Cookie: "locale=en-US",
                    },
                    data: data,
                }
                console.log(config, "config1");
                await axios
                    .request(config)
                    .then(async (ress) => {
                        if (ress.data.code === "0") {
                            console.log(ress.data.data[0], "data1");
                            const acc = {
                                user_id: user._id,
                                label: ress.data.data[0].label,
                                subAcct: ress.data.data[0].subAcct,
                                ts: ress.data.data[0].ts,
                                uid: ress.data.data[0].uid,
                                acctLv: ress.data.data[0].acctLv
                            }
                            console.log(acc, "acc");
                            const account = await subaccount.create(acc)
                            if (account) {
                                let pass = generator.generate({
                                    length: 10,
                                    numbers: true,
                                    uppercase: true,
                                })

                                const phrase = pass + "@"

                                let data1 = JSON.stringify({
                                    subAcct: account.subAcct,
                                    label: account.label,
                                    passphrase: phrase,
                                    perm: "trade",
                                    ip: "134.209.100.33,49.207.189.157"
                                });


                                var domain = "https://www.imperialx.exchange";
                                var apiKey = 'f546a753-21b1-452b-b02a-05a6019e27a2';
                                var secretKey = 'F3F34BAAFE81DB29CE5FD38546C22ED9';
                                var passphrase = 'Impx@123';
                                var iosTime = new Date().toISOString();
                                var method = "POST";
                                var textToSign = "";
                                textToSign += iosTime;
                                textToSign += method;
                                textToSign += `/api/v5/broker/nd/subaccount/apikey${data1}`;
                                console.log(data1, "account name");

                                var sign = CryptoJS.enc.Base64.stringify(
                                    CryptoJS.HmacSHA256(
                                        iosTime + "POST" + `/api/v5/broker/nd/subaccount/apikey${data1}`,
                                        `${secretKey}`
                                    )
                                );
                                console.log(sign, "sigb");
                                let config = {
                                    method: "post",
                                    maxBodyLength: Infinity,
                                    url: `https://www.okx.com/api/v5/broker/nd/subaccount/apikey`,
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
                                            // let apdata = {
                                            //     user_id: user._id,
                                            //     apikey: ress.data.data[0].apiKey,
                                            //     secretkey: ress.data.data[0].passphrase,
                                            //     passphrase: ress.data.data[0].passphrase
                                            // }

                                            const sukey = await subkey.create({
                                                user_id: user._id,
                                                apikey: ress.data.data[0].apiKey,
                                                secretkey: ress.data.data[0].secretKey,
                                                passphrase: ress.data.data[0].passphrase,
                                                permission: "Read/write",
                                                exchange: "okx",
                                                trade_base: {
                                                    spot: true,
                                                    margin: true,
                                                    future: true
                                                }

                                            })
                                            if (sukey) {
                                                res.status(200).json({
                                                    success: true,
                                                    result: "",
                                                    message: "Created successfully"
                                                });
                                            } else {
                                                res.status(200).json({
                                                    success: false,
                                                    result: "",
                                                    message: "Api key creation failed"
                                                });
                                            }
                                        } else {
                                            res.status(200).json({
                                                success: false,
                                                result: "",
                                                message: "Api Key Not Created"
                                            });
                                        }


                                    })
                            } else {
                                res.status(200).json({
                                    success: false,
                                    result: "",
                                    message: "Suc-account Creation failed"
                                });
                            }

                        } else {
                            res.status(200).json({
                                success: false,
                                result: "",
                                message: "Suc-account Creation failed"
                            });
                        }
                    })

            }
        } else {
            res.status(200).json({
                success: false,
                result: "",
                message: "Please verify Email"
            });
        }
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = { createsubaccount };
