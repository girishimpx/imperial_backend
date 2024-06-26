const tickers = require("../../models/allTickers");
const { handleError } = require("../../middleware/utils/handleError");
const axios = require("axios");
const CryptoJS = require("crypto-js");

const orderbookdetailes = async (req, res) => {
    try {
    
        var { type, ccy } = req.body;
        var type = type.toLowerCase()
        // console.log(type, ccy,'*******************');
        var Endpoint;
        if(ccy != undefined && ccy != ""){
            Endpoint = `https://api.bybit.com/v5/market/tickers?category=${type}&symbol=${ccy}`;
        } else {
            Endpoint = `https://api.bybit.com/v5/market/tickers?category=${type}`;
        }
       
        const recvWindow = 50000;
        const apiKey = '0l0RFNXVkw0F0YfhDY';
        const apiSecret = 'vqw7hgSgKaB8sLPFal42zDj5cU9JQQsAx4Ei';
        const Timestamp = new Date().getTime();
        // console.log(Endpoint,'Endpoint');
        const UrlObject = new URL(Endpoint);
        const SearchParams = UrlObject.searchParams;
        const QueryString = Timestamp + apiKey + recvWindow + SearchParams;
        const Signature = CryptoJS.HmacSHA256(QueryString, apiSecret).toString(CryptoJS.enc.Hex);

        const Headers = {
            "Host": "api.bybit.com",
            "X-BAPI-SIGN": Signature,
            "X-BAPI-API-KEY": apiKey,
            "X-BAPI-TIMESTAMP": Timestamp,
            "X-BAPI-RECV-WINDOW": recvWindow,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(Endpoint, { headers: Headers });
            // console.log('Address API Response:', response.data);
            
            if(response.data.retCode == 0){
                res.status(200).json({
                    success: true,
                    result: response.data.result.list,
                    message: "Pair Details Found SuccessFully",
                });
            } else {
                res.status(200).json({
                    success: false,
                    result: [],
                    type: type,
                    ccy: ccy,
                    message: response.data.retMsg,
                });
            }

        } catch (error) {
            console.error('OrderBook API Error:', error.message);
        }

    } catch (error) {
        handleError(res, error);
    }
};

module.exports = { orderbookdetailes };
