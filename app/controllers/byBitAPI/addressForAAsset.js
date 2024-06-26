const { handleError } = require('../../middleware/utils');
const SUBACC = require('../../models/subaccount');
const axios = require("axios");
const CryptoJS = require("crypto-js");
const Address = require("../../models/depositeAddress")
const Wallet = require("../../models/wallet");


const addressForAAsset = async (req, res) => {
    try {

        const { coinname, chain } = req.body;
        const USER = req.user

        const addressExist = await Wallet.findOne({ coinname: coinname, user_id: USER._id })
        const heck = USER._id
        const coinAddress = addressExist.mugavari
        // console.log(addressExist,'*******************',coinAddress.length);
        if (coinAddress.length > 0) {
            res.status(200).json({
                success: false,
                result: [],
                message: "Address Created Already",
            });
        } else {

            const subUid = await SUBACC.findOne({ user_id: USER._id });

            const endpoint = `https://api.bybit.com/v5/asset/coin/query-info?coin=${coinname}`;
            const apiKey = '0l0RFNXVkw0F0YfhDY';
            const apiSecret = 'vqw7hgSgKaB8sLPFal42zDj5cU9JQQsAx4Ei';
            const recvWindow = 50000;
            const timestamp = Date.now();
            var check = 0;
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

            axios.get(endpoint, { headers })
                .then(async (response) => {
                    console.log('API Response:', response.data);

                    if (response.data.retCode === 0) {
                        // console.log(response.data.result.rows[0].chains,'TEST');
                        // res.status(200).json({
                        //     success: true,
                        //     result: response.data,
                        //     message: "Addresses created successfully",
                        // });
                        const chains = response.data.result.rows[0].chains;
                        const name = response.data.result.rows[0].name;
                        for (let i = 0; i < chains.length; i++) {
                            // console.log(name,chains[i].chain,'LOOP COINS');
                            const addressEndpoint = `https://api.bybit.com/v5/asset/deposit/query-sub-member-address?coin=${name}&chainType=${chains[i].chain}&subMemberId=${subUid.uid}`;
                            const addressParams = [{ key: "coin", value: coinname }, { key: "chainType", value: chain }, { key: "subMemberId", value: subUid.uid }];
                            const addressJsonParams = JSON.stringify(addressParams);
                            const addressrecvWindow = 50000;
                            const addressTimestamp = new Date().getTime();
                            const addressUrlObject = new URL(addressEndpoint);
                            const addressSearchParams = addressUrlObject.searchParams;
                            const addressQueryString = addressTimestamp + apiKey + addressrecvWindow + addressSearchParams;
                            const addressSignature = CryptoJS.HmacSHA256(addressQueryString, apiSecret).toString(CryptoJS.enc.Hex);

                            const addressHeaders = {
                                "Host": "api.bybit.com",
                                "X-BAPI-SIGN": addressSignature,
                                "X-BAPI-API-KEY": apiKey,
                                "X-BAPI-TIMESTAMP": addressTimestamp,
                                "X-BAPI-RECV-WINDOW": addressrecvWindow,
                                'Content-Type': 'application/json',
                            };

                            try {
                                const addressResponse = await axios.get(addressEndpoint, { headers: addressHeaders });
                                console.log('Address API Response:', addressResponse.data);

                                if (addressResponse.data.retCode == 0) {

                                    // console.log(response,'RESPONSE RAW');

                                    // var payload = await Address.create({
                                    //     name: addressResponse.data.result.coin,
                                    //     ccy: addressResponse.data.result.chains.chain,
                                    //     chain: addressResponse.data.result.chains.chainType,
                                    //     subAcct: subUid.uid,
                                    //     addr: addressResponse.data.result.chains.addressDeposit,
                                    //     user_id: USER._id
                                    //  })

                                    const addr = {
                                        chain: addressResponse.data.result.chains.chainType,
                                        address: addressResponse.data.result.chains.addressDeposit
                                    }

                                    const addressArray = await Wallet.findOneAndUpdate({ coinname: coinname, user_id: USER._id }, { $push: { mugavari: addr } })

                                    check++;
                                } else if (addressResponse.data.retMsg == "Chain is closed for deposit") {
                                    //     var payload = await Address.create({
                                    //     name: addressResponse.data.result.coin,
                                    //     ccy: addressResponse.data.result.chains.chain,
                                    //     chain: addressResponse.data.result.chains.chainType,
                                    //     subAcct: subUid.uid,
                                    //     addr: response.data.retMsg,
                                    //     user_id: USER._id
                                    //  }) 

                                    const addr = {
                                        chain: addressResponse.data.result.chains.chainType,
                                        address: response.data.retMsg
                                    }

                                    const addressArray = await Wallet.findOneAndUpdate({ coinname: coinname, user_id: USER._id }, { $push: { mugavari: addr } })
                                    check++;
                                }


                            } catch (error) {
                                console.error('Address API Error:', error.message);
                            }
                        }

                        if (chains.length == check) {
                            res.status(200).json({
                                success: true,
                                result: [],
                                message: "Addresses created successfully",
                            });
                        } else {
                            res.status(200).json({
                                success: false,
                                result: [],
                                message: "Error Occured While Creating Address For Some Coins",
                            });
                        }


                    } else {
                        res.status(200).json({
                            success: false,
                            result: [],
                            message: response.data.retMsg,
                        });
                    }
                })
                .catch(error => {
                    console.error('Main API Error:', error.message);
                });
        }
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = { addressForAAsset };
