const { handleError } = require("../../middleware/utils");
const ASSETS = require("../../models/assets");
const SUB = require("../../models/subaccount");
const Address = require("../../models/depositeAddress")
const axios = require("axios");
const CryptoJS = require("crypto-js");

const createDepositAddress = async (req, res) => {
    try {

      const serverTimestampResponse = await axios.get('https://api.bybit.com/v2/public/time');
      console.log(serverTimestampResponse,'TIME STAMP');
      const ts = serverTimestampResponse.data.time_now

        const userID = req.user; 
        const allAssets = await ASSETS.find();
        const userUid = await SUB.findOne({user_id : userID._id});
        const apiKey = '0l0RFNXVkw0F0YfhDY';
        const apiSecret = 'vqw7hgSgKaB8sLPFal42zDj5cU9JQQsAx4Ei';
        const recvWindow = 50000;
        let check = 0;

        for (let i = 0; i < allAssets.length; i++) {

            // const serverTimestampResponse = await axios.get('https://api.bybit.com/v2/public/time');
            // const ts = serverTimestampResponse.data.time_now + 1000

            const endpoint = `https://api.bybit.com/v5/asset/deposit/query-sub-member-address?coin=${allAssets[i].coinname}&chainType=${allAssets[i].symbol}&subMemberId=${userUid.uid}`;
            const params = [{ key: "coin", value: allAssets[i].coinname }, { key: "chainType", value: allAssets[i].symbol }, { key: "subMemberId", value: userUid.uid }];
            const jsonParams = JSON.stringify(params);


            // const timestamp = new Date().getTime() + 1000;
            const timestamp = ts
            const adjustedTimestamp = timestamp + 1000;
            console.log("Adjusted Timestamp:", adjustedTimestamp);
            

            const urlObject = new URL(endpoint);
            const searchParams = urlObject.searchParams;

            const queryString = ts + apiKey + recvWindow + searchParams
            const signature = CryptoJS.HmacSHA256(queryString, apiSecret).toString(CryptoJS.enc.Hex);

            const headers = {
                "Host": "api.bybit.com",
                "X-BAPI-SIGN": signature,
                "X-BAPI-API-KEY": apiKey,
                "X-BAPI-TIMESTAMP": timestamp,
                "X-BAPI-RECV-WINDOW": recvWindow,
                'Content-Type': 'application/json',
            };

            console.log(endpoint,'endpoint');
            console.log(searchParams,'searchParams');
            console.log(headers,'headers');

            try {
                const response = await axios.get(endpoint, { headers });
                console.log('API Response:', response.data);

                if (response.data.retCode === 0) {
           
                  var payload = await Address.create({
                    ccy: allAssets[i].symbol,
                    chain: allAssets[i].coinname,
                    subAcct: userUid.uid,
                    addr: response.data.result.chains.addressDeposit,
                    user_id: userID
                })

                    check++;
                } 

                else if (response.data.retMsg == "Chain is closed for deposit"){
                  var payload = await Address.create({
                    ccy: allAssets[i].symbol,
                    chain: allAssets[i].coinname,
                    subAcct: userUid.uid,
                    addr: response.data.retMsg,
                    user_id: userID
                })
                check++;
                }
            } catch (error) {
                console.error('Error:', error.message);
            }

        }

        if (check === allAssets.length) {
            res.status(200).json({
                success: true,
                data: [],
                message: "Deposit Addresses Created Successfully"
            });
        } else {
            res.status(200).json({
                success: false,
                data: [],
                message: "Error Occurred While Creating Some Addresses"
            });
        }
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = { createDepositAddress };
