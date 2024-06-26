const { handleError } = require("../../middleware/utils");
const copytrade = require('../../models/copytrade');
const { RestClientV5 } = require('bybit-api');
const USER = require('../../models/user')
const referral = require('../../models/referral')
const referredAmount = require('../../models/referralAmount')
const { getLivePrice } = require('../auth/helpers')

const getWalletById = async (req, res) => {
    const user = req?.user?._id
    const traderKey = await copytrade.findOne({ user_id: user })
    // console.log(traderKey, 'traderkey');
    let total_price_in_usd = 0
    try {
        const client = new RestClientV5({
            testnet: false,
            key: traderKey.apikey,
            secret: traderKey.secretkey
        });

        const depositOnChain = await client.getDepositRecords({ coin: 'USDT' })
        // console.log(depositOnChain, 'depositOnChain');
        // const depositOnChain = {
        //     "retCode": 0,
        //     "retMsg": "success",
        //     "result": {
        //         "rows": [
        //             {
        //                 "coin": "BTC",
        //                 "chain": "ETH",
        //                 "amount": "0.02",
        //                 "txID": "skip-notification-scene-test-amount-202212270944-533285-USDT",
        //                 "status": 3,
        //                 "toAddress": "test-amount-address",
        //                 "tag": "",
        //                 "depositFee": "",
        //                 "successAt": "1672134274000",
        //                 "confirmations": "1000",
        //                 "txIndex": "",
        //                 "blockHash": "",
        //                 "batchReleaseLimit": "-1",
        //                 "depositType": "0"
        //             },
        //             // {
        //             //     "coin": "USDT",
        //             //     "chain": "ETH",
        //             //     "amount": "500000",
        //             //     "txID": "skip-notification-scene-test-amount-202212270944-533285-USDT",
        //             //     "status": 3,
        //             //     "toAddress": "test-amount-address",
        //             //     "tag": "",
        //             //     "depositFee": "",
        //             //     "successAt": "1672134273900",
        //             //     "confirmations": "10000",
        //             //     "txIndex": "",
        //             //     "blockHash": "",
        //             //     "batchReleaseLimit": "-1",
        //             //     "depositType": "0"
        //             // },
        //         ],
        //         "nextPageCursor": "eyJtaW5JRCI6MTA0NjA0MywibWF4SUQiOjEwNDYwNDN9"
        //     },
        //     "retExtInfo": {},
        //     "time": 1672191992512
        // };
        const rows = depositOnChain?.result?.rows;

        const depositOffChain = await client.getInternalDepositRecords({})
        // console.log(depositOffChain, 'depositOffChain');
        // const depositOffChain = {

        //     "retCode": 0,
        //     "retMsg": "success",
        //     "result": {
        //         "rows": [
        //             {
        //                 "id": "1103",
        //                 "amount": "0.02",
        //                 "type": 1,
        //                 "coin": "ETH",
        //                 "address": "xxxx***@gmail.com",
        //                 "status": 2,
        //                 "createdTime": "1705393280",
        //                 "txID": "77c37e5c-d9fa-41e5-bd13-c9b59d95"
        //             },
        //             // {
        //             //     "id": "1103",
        //             //     "amount": "0.1",
        //             //     "type": 1,
        //             //     "coin": "ETH",
        //             //     "address": "xxxx***@gmail.com",
        //             //     "status": 2,
        //             //     "createdTime": "1705393281",
        //             //     "txID": "77c37e5c-d9fa-41e5-bd13-c9b59d95"
        //             // },
        //             // {
        //             //     "id": "1103",
        //             //     "amount": "0.1",
        //             //     "type": 1,
        //             //     "coin": "ETH",
        //             //     "address": "xxxx***@gmail.com",
        //             //     "status": 2,
        //             //     "createdTime": "1705393279",
        //             //     "txID": "77c37e5c-d9fa-41e5-bd13-c9b59d95"
        //             // },
        //         ],
        //         "nextPageCursor": "eyJtaW5JRCI6MTEwMywibWF4SUQiOjExMDN9"
        //     },
        //     "retExtInfo": {},
        //     "time": 1705395632689

        // }
        const rows1 = depositOffChain?.result?.rows;
        let depositOnChain1 = rows?.length > 0 ? rows[0] : '';

        if (rows?.length > 0 && rows1?.length > 0) {
            for (let i = 0; i < rows?.length; i++) {
                // console.log('foorloop1');
                if (rows[i]?.successAt < depositOnChain1?.successAt) {
                    depositOnChain1 = rows[i];
                }
            }
            // console.log(depositOnChain1, 'depositOnChain1');
            let depositOffChain1 = rows1?.length > 0 ? rows1[0] : ""

            for (let i = 0; i < rows1?.length; i++) {
                // console.log('foorloop2');
                if (rows1[i]?.createdTime < depositOffChain1?.createdTime) {
                    depositOffChain1 = rows1[i];
                }
            }
            // console.log(depositOffChain1, 'depositOffChain1');
            const deposit = {
                depositOnChain: depositOnChain1,
                depositOffChain: depositOffChain1
            };

            // console.log(deposit, 'deposit');

            const time = Number(deposit?.depositOnChain?.successAt);
            const date = new Date(time * 1000);
            // console.log(date, 'dateee');
            const utcString = date.toUTCString();
            const unixTimestamp = Number(deposit?.depositOffChain?.createdTime);
            const date1 = unixTimestamp ? new Date(unixTimestamp * 1000) : 0
            const utcDateString = date1?.toUTCString();
            // console.log(utcString, 'utcString');
            // console.log(utcDateString, 'utcDateString');

            let result;
            if (utcString < utcDateString) {
                result = depositOnChain1;
            } else {
                result = depositOffChain1;
            }
            // console.log(result, 'result');
            if (result.coin == 'USDT') {
                total_price_in_usd = result?.amount
            }
            else {
                const coin = result?.coin
                const live_price = await getLivePrice(coin)
                // console.log(live_price, 'price');
                const bal = live_price * Number(result?.amount)
                total_price_in_usd = Math.round(bal)
                // console.log(Math.round(total_price_in_usd), total_price_in_usd, 'total_price_in_usd');
            }

            const eligiblecheck = await USER.findById(user._id)

            // if (eligiblecheck.iseligible == 'null') {

            if (total_price_in_usd >= 50 && eligiblecheck?.referred_by_code && traderKey?.follower_user_id.length > 0) {
                const alreadyReferreduser = await referral.findOne({ user_id: user })
                if (alreadyReferreduser) {
                    res.status(201).json({
                        success: true,
                        message: "user already referred"
                    })
                }
                else {
                    const referralAmount = await referredAmount.findOne({})
                    for (let i = 0; i < traderKey?.follower_user_id?.length; i++) {
                        const newData = new referral({
                            user_id: user,
                            referral_id: traderKey?.follower_user_id[i]?.follower_id,
                            referral_code: eligiblecheck?.referred_by_code,
                            is_deposit: true,
                            is_copytrade: true,
                            is_reward: 0,
                            amount: referralAmount?.amount
                        })
                        newData.save()
                    }


                    const eligibleUser = await USER.findOne({ _id: eligiblecheck.referred_by_id })
                    const updateReedeme = {
                        redeem_points: eligibleUser?.redeem_points == '0' ? referralAmount?.amount : Number(eligibleUser?.redeem_points) + Number(referralAmount?.amount),
                        total_reward: eligibleUser?.total_reward == 0 ? referralAmount?.amount : Number(eligibleUser?.total_reward) + Number(referralAmount?.amount),
                        is_reward: 0
                    }
                    const UpdateeligibleUser = await USER.findOneAndUpdate({ _id: eligiblecheck?.referred_by_id }, updateReedeme)

                    if (UpdateeligibleUser) {
                        res.status(200).json({
                            success: true,
                            message: "you are eligible",
                            result: ""
                        })
                    }
                }
            }
            else {
                // const UneligibleUser = await USER.findByIdAndUpdate({ _id: user._id }, { iseligible: 'not_eligible', referaldeposit: 'not_eligible' })
                // if (UneligibleUser) {
                res.status(201).json({
                    success: false,
                    message: "you are not eligible",
                    result: ""
                })
                // }
            }

            // }
        }
        else {
            res.status(201).json({
                success: false,
                message: "No data",
                result: ""
            })
        }
    } catch (error) {
        handleError(res, error);
    }
}

module.exports = { getWalletById };
