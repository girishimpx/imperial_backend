const { handleError } = require('../../middleware/utils')
const { RestClientV5 } = require('bybit-api');
const apiData = require('../../models/copytrade')

const CryptoJS = require('crypto-js');
const axios = require('axios');

const getSubAccBalance = async (req, res) => {
    const user_id = req.user._id
    const { accountType, coin } = req.body

    try {
        const keyData = await apiData.findOne({ user_id: user_id })
        console.log(keyData, 'keyData');

        var apikey = keyData.apikey;
        var secretKey = keyData.secretkey;
        var ts = Date.now();
        var recvWindow = 50000;
        var queryString = `accountType=${accountType}&coin=${coin}`;
        var preSignString = ts + apikey + recvWindow + queryString;
        let signature = CryptoJS.HmacSHA256(preSignString, secretKey).toString(CryptoJS.enc.Hex);
        // console.log(signature, 'sign');
        let config = {
            method: 'get',
            url: `https://api.bybit.com/v5/asset/transfer/query-account-coin-balance?accountType=${accountType}&coin=${coin}`,
            headers: {
                'X-BAPI-API-KEY': apikey,
                'X-BAPI-TIMESTAMP': ts,
                'X-BAPI-RECV-WINDOW': recvWindow,
                'X-BAPI-SIGN': signature
            }
        };

        axios(config)
            .then((response) => {
                // console.log(response.data, 'response data');

                res.status(200).json({
                    success: true,
                    result: response.data.result.balance,
                    message: 'Balance Data Fetched Successfully'
                });
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({
                    success: false,
                    message: 'An error occurred while fetching the balance data',
                    error: error.message
                });
            });


    } catch (error) {
        handleError(res, error)
    }

}

module.exports = { getSubAccBalance }