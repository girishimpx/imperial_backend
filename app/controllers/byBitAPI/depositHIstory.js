const { handleError } = require("../../middleware/utils");
const ASSETS = require("../../models/assets");
const SUB = require("../../models/subaccount");
const Address = require("../../models/depositeAddress")
const axios = require("axios");
const CryptoJS = require("crypto-js");

const depositHIstory = async (req, res) => {
    try {

        console.log('GEWCCTF*******************');
        const userID = req.user; 
        const allAssets = await ASSETS.find();
        const userUid = await SUB.findOne({user_id : userID._id});
        const apiKey = '0l0RFNXVkw0F0YfhDY';
        const apiSecret = 'vqw7hgSgKaB8sLPFal42zDj5cU9JQQsAx4Ei';
        const recvWindow = 50000;
        let check = 0;


            const endpoint = `/v5/asset/deposit/query-sub-member-record?subMemberId=${userUid.uid}`

            const timestamp = new Date().getTime() + 1000;
            

            const urlObject = new URL(endpoint);
            const searchParams = urlObject.searchParams;

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

            // console.log(endpoint,'endpoint');
            // console.log(searchParams,'searchParams');
            // console.log(headers,'headers');

                const response = await axios.get(endpoint, { headers });
                console.log('API Response:', response.data);

                if (response.data.retCode == 0) {
                    res.status(200).json({
                        success : true,
                        data : response.data.result.rows,
                        message : "Deposit History Found SuccessFully"
                    })
                } else {
                    res.status(200).json({
                        success : false,
                        data : [],
                        message : response.data.retMsg
                    })
                }
            
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = { depositHIstory };
