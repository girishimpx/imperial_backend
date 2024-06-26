const { RestClientV5 } = require('bybit-api');
const copyTrade = require('../../models/copytrade')
const { handleError } = require('../../middleware/utils')
const mongoose = require("mongoose");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const { getLinearLivePrice } = require('./helpers/getLinearLivePrice')

const FutureTradeHistory = async (req, res) => {

    const user_id = req.user._id
    const symbol = req.body.symbol
    // console.log(symbol, 'FutureSymbolfor**');
    try {

        const apidata = await copyTrade.findOne({ user_id: user_id })
        if (apidata) {
            try {
                // const endpoint = 'https://api.bybit.com/v5/execution/list?category=linear';
                const endpoint = `https://api.bybit.com/v5/order/realtime?symbol=${symbol}&category=linear&openOnly=1`
                // console.log(endpoint, 'endpoint');
                const apiKey = apidata.apikey;
                const apiSecret = apidata.secretkey;
                const recvWindow = 50000

                const urlObject = new URL(endpoint);
                const searchParams = urlObject.searchParams;
                const timestamp = Date.now();
                const queryString = timestamp + apiKey + recvWindow + searchParams
                const signature = CryptoJS.HmacSHA256(queryString, apiSecret).toString(CryptoJS.enc.Hex);

                const headers = {
                    "Host": "api.bybit.com",
                    "X-BAPI-SIGN": signature,
                    "X-BAPI-API-KEY": apiKey,
                    "X-BAPI-TIMESTAMP": timestamp,
                    "X-BAPI-RECV-WINDOW": recvWindow,
                    'Content-Type': 'application/json',
                };


                axios.get(endpoint, { headers })
                    .then(async (response) => {
                        console.log('API Response:', response.data);
                        // const livePrice = await getLinearLivePrice(symbol)
                        // console.log(livePrice, 'markprice');
                        if (response.data.retCode == 0) {
                            res.status(200).json({
                                success: true,
                                data: response.data.result.list,
                                message: "Data Founded SuccessFully"
                            })

                        } else {
                            res.status(200).json({
                                success: false,
                                data: [],
                                message: response.data.retMsg,
                            })
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error.message);
                    });


            } catch (error) {
                handleError(res, error);
            }

        }
        else {
            res.status(201).json({
                success: false,
                message: "User not found",
                result: ''
            })
        }
    }

    catch (error) {
        handleError(res, error)
    }
}


module.exports = { FutureTradeHistory }

