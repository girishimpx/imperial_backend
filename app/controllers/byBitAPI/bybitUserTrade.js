const trade = require("../../models/trade");
const { handleError } = require("../../middleware/utils");
const { matchedData } = require("express-validator");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const { setCollatralCoin } = require('./setCollatralCoin');
const copytrade = require("../../models/copytrade");
const tradePAirs = require("../../models/tradePairs");
const { RestClientV5 } = require('bybit-api');
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const bybitUserTrade = async (req, res) => {

    try {
        // console.log('ENTERED');
        const user = req.user;
        req = matchedData(req);
        const keydata = await copytrade.findOne({ user_id: user._id });
        console.log(keydata,'keydata');
        const client = new RestClientV5({
            key: keydata.apikey,
            secret: keydata.secretkey,
            testnet: false,
        },);
        // const client = new RestClientV5({
        //     key: 'k275LvibTuETBCyee4',
        //     secret: 'FgkirdabUW68X7zI8Fosp4DL2S7Dv4SwzSvM',
        //     demoTrading: true,
        // },);
        if (req.trade_at == "spot") {

            if (req.orderType == "market") {
                console.log(req, 'market');
                await client.submitOrder({
                    category: req.trade_at,
                    symbol: req.instId,
                    side: req.side,
                    orderType: req.orderType,
                    qty: `${req.sz}`,
                    // price: req.px,
                    isLeverage: 0
                })
                    .then(async (result) => {
                        console.log(result, 'DEMO');
                        if (result.retCode == 0) {

                            const tradeData = {
                                user_id: user._id,
                                loan_user_id: user._id,
                                // trade_pair_id: assertpair._id,
                                // asset_id: ASSETS?._id ? ASSETS?._id : assertpair._id,
                                trade_type: req.side,
                                ouid: "ouid",
                                // symbol: req.instId.split("-")[0],
                                symbol: req.instId.slice(0, -4),
                                order_id: result.result.orderId,
                                pair: req.instId,
                                order_type: req.orderType,
                                volume: Number(req.sz),
                                leverage: req.lever || 0,
                                trade_at: req.trade_at,
                                entry_price: req.px,
                                trade_in: "bybit",
                                tpPrice: req.tpPrice ? req.tpPrice : '--',
                                slPrice: req.slPrice ? req.slPrice : '--'
                            }

                            await trade.create(tradeData)

                            res.status(200).json({
                                success: true,
                                result: [],
                                message: "Trade Placed SuccessFully",
                            });
                        } else if (result.retMsg == "ab not enough for new order") {
                            res.status(200).json({
                                success: false,
                                result: [],
                                message: "Insufficient Balance",
                            });
                        } else {
                            console.log(result,'result');
                            res.status(200).json({
                                success: false,
                                result: result.retCode,
                                message: result.retMsg,
                            });
                        }
                    })
                    .catch(err => {
                        console.error("Trade error: ", err);
                        handleError(res, err);
                    });

            } else if (req.orderType.toLowerCase() == "limit") {
                var params = {};
                if(req.istpsl === true){
                    params = {
                        category: req.trade_at,
                        symbol: req.instId,
                        side: req.side,
                        orderType: req.orderType,
                        qty: Number(req.sz) > 0 ? `${Number(req.sz)}` : '1',
                        price: `${req.px}`,
                        timeInForce: 'GTC',
                        takeProfit: req.tpPrice,
                        stopLoss: req.slPrice,
                        tpOrderType: 'limit',
                        slOrderType: 'limit',
                        tpLimitPrice: req.tpPrice,
                        slLimitPrice: req.slPrice,
                        tpslMode: 'Partial'
                    }
                } else{
                    params = {
                    category: req.trade_at,
                    symbol: req.instId,
                    side: req.side,
                    orderType: req.orderType,   
                    qty: Number(req.sz) > 0 ? `${Number(req.sz)}` : '1',
                    price: `${req.px}`
                    }
                }
                // await client.submitOrder({
                //     category: req.trade_at,
                //     symbol: req.instId,
                //     side: req.side,
                //     orderType: req.orderType,
                //     qty: req.sz,
                //     price: req.px
                // })
                console.log(params,'Parameter for spot limit');
                await client.submitOrder(params)
                    .then(async (result) => {
                        console.log(result,'tradeResult');
                        if (result.retCode == 0) {
                            const tradeData = {
                                user_id: user._id,
                                loan_user_id: user._id,
                                trade_type: req.side,
                                ouid: "ouid",
                                symbol: req.instId.slice(0, -4),
                                order_id: result.result.orderId,
                                pair: req.instId,
                                order_type: req.orderType,
                                volume: Number(req.sz),
                                leverage: req.lever || 0,
                                trade_at: req.trade_at,
                                entry_price: req.px,
                                trade_in: "bybit",
                                tpPrice: req.tpPrice ? `${req.tpPrice}` : '--',
                                slPrice: req.slPrice ? `${req.slPrice}` : '--'
                            }

                            await trade.create(tradeData)
                            res.status(200).json({
                                success: true,
                                result: [],
                                message: "Trade Placed SuccessFully",
                            });
                        } else if (result.retMsg == "ab not enough for new order") {
                            res.status(200).json({
                                success: false,
                                result: [],
                                message: "Insufficient Balance",
                            });
                        } else {
                            res.status(200).json({
                                success: false,
                                result: [],
                                message: result.retMsg,
                            });
                        }
                    })
                    .catch(err => {
                        console.error("Trade error: ", err);
                        handleError(res, err);
                    });

            }

        } else if (req.trade_at == "Margin") {
            console.log(req.side,'WHICH SIDE');
            if (req.side == "Buy" || req.side == "buy") {

               
                    const leverageData = await client.setSpotMarginLeverage(`${req.lever}`)
                    console.log(leverageData,'lecerefvfrbtr');

                    if(leverageData.retCode == 0 || leverageData.retMsg == "leverage not modified"){
                        console.log(leverageData.retMsg);
                    } else {
                        res.status(200).json({
                            success: false,
                            result: [],
                            message: leverageData.retMsg,
                        });
                    }
               

                const mode = req.tdMode == "isolated" ? 'ISOLATED_MARGIN' : 'REGULAR_MARGIN'
                console.log(mode, 'MODE MARGIN');
                const data = await client.setMarginMode(mode)
                // console.log(data, 'DATA MARGIN');
                if (data.retCode == 0) {

                    console.log('SWITCHEDDD TO MARGIN', req.tdMode);

                        var params = {};
                        if(req.istpsl === true){
                            params = {
                                category: 'spot',
                                symbol: req.instId,
                                side: req.side,
                                orderType: req.orderType,
                                qty: Number(req.sz) > 0 ? `${req.sz}` : '1',
                                price: req.px,
                                timeInForce: 'GTC',
                                takeProfit: req.tpPrice,
                                stopLoss: req.slPrice,
                                tpOrderType: 'limit',
                                slOrderType: 'limit',
                                tpLimitPrice: req.tpPrice,
                                slLimitPrice: req.slPrice,
                                isLeverage: 1
                            }
                        } else{
                            params = {
                            category: 'spot',
                            symbol: req.instId,
                            side: req.side,
                            orderType: req.orderType,
                            qty: Number(req.sz) > 0 ? `${req.sz}` : '1',
                            price: req.px,
                            isLeverage: 1 
                            }
                        }
                        console.log(params,'Parameter for margin limit');
                        const tradeData = await client.submitOrder(params)

                        if (tradeData.retCode == 0) {
                            const tradee = {
                                user_id: user._id,
                                loan_user_id: user._id,
                                trade_type: req.side,
                                ouid: "ouid",
                                symbol: req.instId.slice(0, -4),
                                order_id: tradeData.result.orderId,
                                pair: req.instId,
                                order_type: req.orderType,
                                volume: Number(req.sz),
                                leverage: req.lever || 0,
                                trade_at: req.trade_at,
                                entry_price: req.px,
                                trade_in: "bybit",
                                tpPrice: req.tpPrice ? req.tpPrice : '--',
                                slPrice: req.slPrice ? req.slPrice : '--'
                            }

                            await trade.create(tradee)

                            res.status(200).json({
                                success: true,
                                result: [],
                                message: "Trade Placed SuccessFully",
                            });
                        } else if (tradeData.retMsg == "ab not enough for new order") {
                            res.status(200).json({
                                success: false,
                                result: [],
                                message: "Insufficient Balance",
                            });
                        } else {
                            // console.log(tradeData);
                            res.status(200).json({
                                success: false,
                                result: [],
                                message: tradeData.retMsg,
                            });
                        }
                    


                } else {
                    res.status(200).json({
                        success: true,
                        result: [],
                        message: data.retMsg,
                    });
                }
            } else if (req.side == "Sell" || req.side == "sell") {

              
                    const leverageData = await client.setSpotMarginLeverage(`${req.lever}`)
                    console.log(leverageData,'lecerefvfrbtr');

                    if(leverageData.retCode == 0 || leverageData.retMsg == "leverage not modified"){
                        console.log(leverageData.retMsg);
                    } else {
                        res.status(200).json({
                            success: false,
                            result: [],
                            message: leverageData.retMsg,
                        });
                    }

                const mode = req.tdMode == "isolated" ? 'ISOLATED_MARGIN' : 'REGULAR_MARGIN'
                console.log(mode, 'MODE MARGIN');
                const data = await client.setMarginMode(mode)
                console.log(data, 'MARGIN MODE RESPONSE');
                if (data.retCode == 0) {
                    console.log('SETTING COLLATREAL COIN');
                    const collatreldata = await setCollatralCoin(req, res, keydata)
                    console.log(collatreldata, '*******************');
                    console.log('COIN COLATRELLED');
                    if (collatreldata.success == true) {

                           
                        var params = {};
                        if(req.istpsl === true){
                            params = {
                                category: 'spot',
                                symbol: req.instId,
                                side: req.side,
                                orderType: req.orderType,
                                qty: Number(req.sz) > 0 ? `${req.sz}` : '1',
                                price: req.px,
                                timeInForce: 'GTC',
                                takeProfit: req.tpPrice,
                                stopLoss: req.slPrice,
                                tpOrderType: 'limit',
                                slOrderType: 'limit',
                                tpLimitPrice: req.tpPrice,
                                slLimitPrice: req.slPrice,
                                isLeverage: 1
                            }
                        } else{
                            params = {
                            category: 'spot',
                            symbol: req.instId,
                            side: req.side,
                            orderType: req.orderType,
                            qty: Number(req.sz) > 0 ? `${req.sz}` : '1',
                            price: req.px,
                            isLeverage: 1 
                            }
                        }

                            const tradeData = await client.submitOrder(params)

                            if (tradeData.retCode == 0) {
                                const tradee = {
                                    user_id: user._id,
                                    loan_user_id: user._id,
                                    trade_type: req.side,
                                    ouid: "ouid",
                                    symbol: req.instId.slice(0, -4),
                                    order_id: tradeData.result.orderId,
                                    pair: req.instId,
                                    order_type: req.orderType,
                                    volume: Number(req.sz),
                                    leverage: req.lever || 0,
                                    trade_at: req.trade_at,
                                    entry_price: req.px,
                                    trade_in: "bybit",
                                    tpPrice: req.tpPrice ? req.tpPrice : '--',
                                    slPrice: req.slPrice ? req.slPrice : '--'
                                }

                                await trade.create(tradee)

                                res.status(200).json({
                                    success: true,
                                    result: [],
                                    message: "Trade Placed SuccessFully",
                                });
                            } else if (tradeData.retMsg == "ab not enough for new order") {
                                res.status(200).json({
                                    success: false,
                                    result: [],
                                    message: "Insufficient Balance",
                                });
                            } else {
                                // console.log(tradeData);
                                res.status(200).json({
                                    success: false,
                                    result: [],
                                    message: tradeData.retMsg,
                                });
                            }
                        

                    } else {
                        res.status(200).json({
                            success: false,
                            result: [],
                            message: collatreldata.message,
                        });
                    }

                } else {
                    res.status(200).json({
                        success: true,
                        result: [],
                        message: data.retMsg,
                    });
                }
            }


        } 
        // else if (req.trade_at == "Margin" && req.tdMode == "isolated") {
        //     if (req.side == "Buy" || req.side == "buy") {

        //         // const data = await client.toggleSpotMarginTrade(1)
        //         // console.log(data,'*******************');
        //         const mode = req.tdMode == "isolated" ? 'ISOLATED_MARGIN' : 'REGULAR_MARGIN'
        //         console.log(mode, 'MODE MARGIN');
        //         const data = await client.setMarginMode(mode)
        //         console.log('MARGIN MODE');
        //         if (data.retCode == 0) {

        //             const leverageData = await client.setLeverage({
        //                 category: 'linear',
        //                 symbol: req.instId,
        //                 buyLeverage: req.lever > 0 ? `${req.lever}` : '1',
        //                 sellLeverage: req.lever > 0 ? `${req.lever}` : '1',
        //             })

        //             if (leverageData.retCode == 0) {
        //                 console.log('SWITCHED TO MARGIN', req.tdMode);
        //                 const tradeData = await client.submitOrder({
        //                     category: 'spot',
        //                     symbol: req.instId,
        //                     side: req.side,
        //                     orderType: req.orderType,
        //                     qty: req.sz,
        //                     price: req.px,
        //                     isLeverage: 1
        //                 })

        //                 if (tradeData.retCode == 0) {

        //                     const tradee = {
        //                         user_id: user._id,
        //                         loan_user_id: user._id,
        //                         trade_type: req.side,
        //                         ouid: "ouid",
        //                         symbol: req.instId.slice(0, -4),
        //                         order_id: tradeData.result.orderId,
        //                         pair: req.instId,
        //                         order_type: req.orderType,
        //                         volume: Number(req.sz),
        //                         leverage: req.lever || 0,
        //                         trade_at: req.trade_at,
        //                         entry_price: req.px,
        //                         trade_in: "bybit",
        //                     }

        //                     await trade.create(tradee)

        //                     res.status(200).json({
        //                         success: true,
        //                         result: [],
        //                         message: "Trade Placed SuccessFully",
        //                     });
        //                 } else if (tradeData.retMsg == "ab not enough for new order") {
        //                     res.status(200).json({
        //                         success: false,
        //                         result: [],
        //                         message: "Insufficient Balance",
        //                     });
        //                 } else {
        //                     // console.log(tradeData);
        //                     res.status(200).json({
        //                         success: false,
        //                         result: [],
        //                         message: tradeData.retMsg,
        //                     });
        //                 }
        //             } else {
        //                 res.status(200).json({
        //                     success: false,
        //                     result: [],
        //                     message: leverageData.retMsg,
        //                 });
        //             }

        //         } else {
        //             res.status(200).json({
        //                 success: true,
        //                 result: [],
        //                 message: data.retMsg,
        //             });
        //         }

        //     } else if (req.side == "Sell" || req.side == "sell") {
        //         const mode = req.tdMode == "isolated" ? 'ISOLATED_MARGIN' : 'REGULAR_MARGIN'
        //         console.log(mode, 'MODE MARGIN');
        //         const data = await client.setMarginMode(mode)
        //         console.log(data, 'MARGIN MODE RESPONSE');
        //         if (data.retCode == 0) {
        //             console.log('SETTING COLLATREAL COIN');
        //             const collatreldata = await setCollatralCoin(req, res, keydata)
        //             console.log(collatreldata, '*******************');
        //             console.log('COIN COLATRELLED');
        //             if (collatreldata.success == true) {

        //                 const leverageData = await client.setLeverage({
        //                     category: 'linear',
        //                     symbol: req.instId,
        //                     buyLeverage: req.lever > 0 ? `${req.lever}` : '1',
        //                     sellLeverage: req.lever > 0 ? `${req.lever}` : '1',
        //                 })

        //                 if (leverageData.retCode == 0 || leverageData.retMsg == "leverage not modified") {
        //                     console.log('SWITCHED TO MARGInnnN', req.tdMode);
        //                     const tradeData = await client.submitOrder({
        //                         category: 'spot',
        //                         symbol: req.instId,
        //                         side: req.side,
        //                         orderType: req.orderType,
        //                         qty: req.sz,
        //                         price: req.px,
        //                         isLeverage: 1
        //                     })

        //                     if (tradeData.retCode == 0) {
        //                         const tradee = {
        //                             user_id: user._id,
        //                             loan_user_id: user._id,
        //                             trade_type: req.side,
        //                             ouid: "ouid",
        //                             symbol: req.instId.slice(0, -4),
        //                             order_id: tradeData.result.orderId,
        //                             pair: req.instId,
        //                             order_type: req.orderType,
        //                             volume: Number(req.sz),
        //                             leverage: req.lever || 0,
        //                             trade_at: req.trade_at,
        //                             entry_price: req.px,
        //                             trade_in: "bybit",
        //                         }

        //                         await trade.create(tradee)

        //                         res.status(200).json({
        //                             success: true,
        //                             result: [],
        //                             message: "Trade Placed SuccessFully",
        //                         });
        //                     } else if (tradeData.retMsg == "ab not enough for new order") {
        //                         res.status(200).json({
        //                             success: false,
        //                             result: [],
        //                             message: "Insufficient Balance",
        //                         });
        //                     } else {
        //                         // console.log(tradeData);
        //                         res.status(200).json({
        //                             success: false,
        //                             result: [],
        //                             message: tradeData.retMsg,
        //                         });
        //                     }
        //                 } else {
        //                     res.status(200).json({
        //                         success: false,
        //                         result: [],
        //                         message: leverageData.retMsg,
        //                     });
        //                 }

        //             } else {
        //                 res.status(200).json({
        //                     success: false,
        //                     result: [],
        //                     message: collatreldata.message,
        //                 });
        //             }

        //         } else {
        //             res.status(200).json({
        //                 success: true,
        //                 result: [],
        //                 message: data.retMsg,
        //             });
        //         }
        //     }
            
        // } 
        else if (req.trade_at == "future-open-long" || req.trade_at == "future-close-long") {
            const mode = req.tdMode == "isolated" ? 'ISOLATED_MARGIN' : 'REGULAR_MARGIN'
            console.log(mode, 'MODE MARGIN');
            console.log('FUTURE MODE');
            const data = await client.setMarginMode(mode)

            console.log(data, 'RESPONSE');
            if (data.retCode == 0) {    
                console.log(req.lever, '*******************');
                const leverageData = await client.setLeverage({
                    category: 'linear',
                    symbol: req.instId,
                    buyLeverage: Number(req.lever) > 0 ? `${req.lever}` : '1',
                    sellLeverage: Number(req.lever) > 0 ? `${req.lever}` : '1',
                })
                console.log(leverageData, 'LEVER');
                if (leverageData.retCode == 0 || leverageData.retMsg == "leverage not modified") {
                    console.log(req.side, 'SIDE');
                    var params = {}
                    if(req.istpsl == true) {
                        console.log('TP/SL TRADE',req);
                        params = {
                        category: 'linear',
                        symbol: req.instId,
                        orderType: 'limit',
                        side: req.side,
                        qty: `${req.sz}`,
                        price: req.px,
                        takeProfit: req.tpPrice,
                        stopLoss: req.slPrice,
                        slOrderType : 'Limit',
                        tpOrderType : 'limit',
                        tpLimitPrice : req.tpPrice,
                        slLimitPrice : req.slPrice,
                        tpslMode : 'Partial',
                        timeInForce : 'GTC',
                        orderFilter : 'Order'
                        }
                    } else {
                        params = {
                            category: 'linear',
                            symbol: req.instId,
                            side: req.side,
                            orderType: req.orderType,
                            qty: `${Number(req.sz)}`,
                            price: req.px,
                            }
                    }
                    console.log(params,'Future trade params');
                    const futureTrade = await client.submitOrder(params)

                    if (futureTrade.retCode == 0) {

                        const futuretrade = {
                            user_id: user._id,
                            loan_user_id: user._id,
                            trade_type: req.side.toLowerCase(),
                            ouid: "ouid",
                            symbol: req.instId.slice(0, -4),
                            order_id: futureTrade.result.orderId,
                            pair: req.instId,
                            order_type: req.orderType,
                            volume: Number(req.sz),
                            leverage: req.lever || 0,
                            trade_at: 'future',
                            entry_price: req.px,
                            trade_in: "bybit",
                            tpPrice: req.tpPrice ? req.tpPrice : '--',
                            slPrice: req.slPrice ? req.slPrice : '--'
                        }

                        await trade.create(futuretrade)

                        res.status(200).json({
                            success: true,
                            result: [],
                            message: "Trade Placed SuccessFully",
                        });
                    } else if (futureTrade.retMsg == "ab not enough for new order") {
                        res.status(200).json({
                            success: false,
                            result: [],
                            message: "Available Balance not enough",
                        });
                    } else {
                        res.status(200).json({
                            success: false,
                            result: [],
                            message: futureTrade.retMsg,
                        });
                    }

                } else {
                    res.status(200).json({
                        success: false,
                        result: [],
                        message: leverageData.retMsg,
                    });
                }
                // res.status(200).json({
                //     success: true,
                //     result: [],
                //     message: "TRADE",
                // });
            } else {
                res.status(200).json({
                    success: false,
                    result: [],
                    message: data.retMsg,
                });
            }
        } else if (req.trade_at === "future-open-short" || req.trade_at === "future-close-short") {
            const mode = req.tdMode == "isolated" ? 'ISOLATED_MARGIN' : 'REGULAR_MARGIN'
            console.log(mode, 'MODE MARGIN');
            const data = await client.setMarginMode(mode)

            console.log(data, 'RESPONSE');
            if (data.retCode == 0) {
                console.log(req.lever, '*******************');
                const leverageData = await client.setLeverage({
                    category: 'linear',
                    symbol: req.instId,
                    buyLeverage: Number(req.lever) > 0 ? `${req.lever}` : '1',
                    sellLeverage: Number(req.lever) > 0 ? `${req.lever}` : '1',
                })
                console.log(leverageData, 'LEVER');
                if (leverageData.retCode == 0 || leverageData.retMsg == "leverage not modified") {
                    console.log(req.side, 'SIDE');

                    var params = {}
                    if(req.istpsl == true) {
                        console.log('TP/SL TRADE',req);
                        params = {
                        category: 'linear',
                        symbol: req.instId,
                        orderType: 'limit',
                        side: req.side,
                        qty: `${req.sz}`,
                        price: req.px,
                        takeProfit: req.tpPrice,
                        stopLoss: req.slPrice,
                        slOrderType : 'Limit',
                        tpOrderType : 'limit',
                        tpLimitPrice : req.tpPrice,
                        slLimitPrice : req.slPrice,
                        tpslMode : 'Partial',
                        timeInForce : 'GTC',
                        orderFilter : 'Order'
                        }
                    } else {
                        params = {
                            category: 'linear',
                            symbol: req.instId,
                            side: req.side,
                            orderType: req.orderType,
                            qty: `${Number(req.sz)}`,
                            price: req.px,
                            }
                    }

                    const futureTrade = await client.submitOrder(params)

                    if (futureTrade.retCode == 0) {

                        const futuretrade = {
                            user_id: user._id,
                            loan_user_id: user._id,
                            trade_type: req.side.toLowerCase(),
                            ouid: "ouid",
                            symbol: req.instId.slice(0, -4),
                            order_id: futureTrade.result.orderId,
                            pair: req.instId,
                            order_type: req.orderType,
                            volume: Number(req.sz),
                            leverage: req.lever || 0,
                            trade_at: 'future',
                            entry_price: req.px,
                            trade_in: "bybit",
                        }

                        await trade.create(futuretrade)

                        res.status(200).json({
                            success: true,
                            result: [],
                            message: "Trade Placed SuccessFully",
                        });
                    } else if (futureTrade.retMsg == "ab not enough for new order") {
                        res.status(200).json({
                            success: false,
                            result: [],
                            message: "Available Balance not enough",
                        });
                    } else {
                        res.status(200).json({
                            success: false,
                            result: [],
                            message: futureTrade.retMsg,
                        });
                    }

                } else {
                    res.status(200).json({
                        success: false,
                        result: [],
                        message: leverageData.retMsg,
                    });
                }

            } else {
                res.status(200).json({
                    success: false,
                    result: [],
                    message: data.retMsg,
                });
            }
        } else {
            res.status(200).json({
                success: false,
                result: [],
                message: "Something Went Wrong",
            })
        }

    } catch (error) {
        handleError(res, error);
    }
};

module.exports = { bybitUserTrade };
