const User = require("../../../models/user");
const { setCollatralCoin } = require('../../byBitAPI/setCollatralCoin');
// const trade = require("../../models/trade");
// const { handleError } = require("../../middleware/utils");
// const { isIDGood } = require("../../middleware/utils/isIDGood");
const { buildErrObject } = require('../../../middleware/utils')
const ctrade = require("../../../models/copytrade");
const CryptoJS = require("crypto-js");
const copytradehistory = require("../../../models/copytradehistory");
const {
  imperialApiAxios,
} = require("../../../middleware/ImperialApi/imperialApi");
const { RestClientV5 } = require('bybit-api');


/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const copTrade = async ( masterid, data, cthdata) => {
  try {
    // const tdata = await ctrade.find({follower_user_id : masterid._id})
    console.log(data,data,cthdata,'masterid');
    const tdata = await ctrade.find({
      "follower_user_id.follower_id": masterid._id,
    });
    console.log(tdata,tdata.length, "tdata")
    var req = data
    if (tdata.length > 0) {
      for (let a = 0; a < tdata.length; a++) {
        

        if (tdata[a].exchange == "imperial") {
          if (tdata[a].trade_base?.spot && data.trade_at === "spot") {
            console.log(data.orderType, "type")
            if (data.orderType === "market") {
              let cdata = {
                instId: data.instId,
                tdMode: data.tdMode,
                ccy: data.ccy,
                tag: data.tag,
                side: data.side,
                ordType: data.orderType,
                sz: data.sz,
              };
              const path = `/api/v5/trade/order${JSON.stringify(cdata)}`;

              const uid = tdata[a]?.user_id;
              const da = await imperialApiAxios(
                "post",
                "https://www.okx.com/api/v5/trade/order",
                path,
                cdata,
                tdata[a].apikey,
                tdata[a].secretkey,
                tdata[a].passphrase
              );
              if (da.code === "0") {

                // let data1 = {
                //   user_id: uid,
                //   loan_user_id: uid,
                //   exchange: tdata[a].exchange,
                //   trade_pair_id: cthdata.trade_pair_id,
                //   asset_id: cthdata.asset_id,
                //   trade_type: cthdata.trade_type,
                //   ouid: "ouid",
                //   symbol: cthdata.symbol,
                //   order_id: da.data[0].ordId,
                //   pair: cthdata.pair,
                //   order_type: cthdata.order_type,
                //   volume: cthdata.volume,
                //   leverage: "0",
                //   trade_at: cthdata.trade_at,
                //   entry_price: data?.orderType == "market" ? data?.market : cthdata.px,
                //   trade_in: "imperial"

                // };
                // console.log(data, "data")
                // try {
                //   const tdatas = await copytradehistory.create(data1);
                //   console.log(tdatas, "tdatas")
                // } catch (error) {
                //   console.log(error, "erae")
                // }

                const cpytrdData = new copytradehistory({
                  user_id: uid,
                  loan_user_id: uid,
                  exchange: tdata[a].exchange,
                  trade_pair_id: cthdata.trade_pair_id,
                  asset_id: cthdata.asset_id,
                  trade_type: cthdata.trade_type,
                  ouid: "ouid",
                  symbol: cthdata.symbol,
                  order_id: da.data[0].ordId,
                  pair: cthdata.pair,
                  order_type: cthdata.order_type,
                  volume: cthdata.volume,
                  leverage: "0",
                  trade_at: cthdata.trade_at,
                  entry_price: data?.orderType == "market" ? data?.market : cthdata.px,
                  trade_in: "imperial"
                 })
                 cpytrdData.save((err) => {
                   if (err) {
                     buildErrObject(200, err.message)
                   } else{
                     console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                   }
                 })

              }
            } else if (data.orderType === "limit") {
              console.log("limit OF COPY TRADE");
              let cdata = {
                instId: data.instId,
                tdMode: data.tdMode,
                ccy: data.ccy,
                tag: data.tag,
                side: data.side,
                ordType: data.orderType,
                sz: data.sz,
                px: data.px,
              };
              const path = `/api/v5/trade/order${JSON.stringify(cdata)}`;
              console.log(path,cdata,'*********8   PARAMS OF COPY TRADE');
              const uid = tdata[a].user_id;
              const da = await imperialApiAxios(
                "post",
                "https://www.okx.com/api/v5/trade/order",
                path,
                cdata,
                tdata[a].apikey,
                tdata[a].secretkey,
                tdata[a].passphrase
              );
              console.log(da,'RESULT OF COPY TRADE ********************************');
              if (da.code === "0") {
                // const data1 = {
                //   user_id: uid,
                //   loan_user_id: uid,
                //   exchange: tdata[a].exchange,
                //   trade_pair_id: cthdata.trade_pair_id,
                //   asset_id: cthdata.asset_id,
                //   trade_type: cthdata.trade_type,
                //   ouid: "ouid",
                //   symbol: cthdata.symbol,
                //   order_id: da.data[0].ordId,
                //   pair: cthdata.pair,
                //   order_type: cthdata.order_type,
                //   volume: cthdata.volume,
                //   price: cthdata.price,
                //   leverage: "0",
                //   trade_at: cthdata.trade_at,
                //   entry_price: data.orderType == "market" ? data.market : cthdata.px,
                //   trade_in: "imperial"
                // };
                // const tdatas = await copytradehistory.create(data1);

                const cpytrdData = new copytradehistory({
                  user_id: uid,
                  loan_user_id: uid,
                  exchange: tdata[a].exchange,
                  trade_pair_id: cthdata.trade_pair_id,
                  asset_id: cthdata.asset_id,
                  trade_type: cthdata.trade_type,
                  ouid: "ouid",
                  symbol: cthdata.symbol,
                  order_id: da.data[0].ordId,
                  pair: cthdata.pair,
                  order_type: cthdata.order_type,
                  volume: cthdata.volume,
                  price: cthdata.price,
                  leverage: "0",
                  trade_at: cthdata.trade_at,
                  entry_price: data.orderType == "market" ? data.market : cthdata.px,
                  trade_in: "imperial"
                 })
                 cpytrdData.save((err) => {
                   if (err) {
                     buildErrObject(200, err.message)
                   } else{
                     console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                   }
                 })

              }
            }
          } else if (data.trade_at === "Margin" && data.tdMode === "isolated" && tdata[a].trade_base?.margin && tdata[a].trade_base?.margin) {
            if (data.orderType === "limit") {
              let cdata = {
                instId: data.instId,
                tdMode: data.tdMode,
                ccy: data.ccy,
                tag: data.tag,
                side: data.side,
                ordType: data.orderType,
                sz: data.sz,
                px: data.px,
              };
              const path = `/api/v5/trade/order${JSON.stringify(cdata)}`;

              const uid = tdata[a].user_id;
              let levdata = JSON.stringify({
                instId: cthdata.pair,
                lever: cthdata.leverage,
                mgnMode: data.tdMode,
              });
              const data1 = await imperialApiAxios(
                "post",
                `https://www.okx.com/api/v5/account/set-leverage`,
                `/api/v5/account/set-leverage${levdata}`,
                levdata,
                tdata[a].apikey,
                tdata[a].secretkey
              );
              if (data1.code === "0") {
                const da1 = await imperialApiAxios(
                  "post",
                  "https://www.okx.com/api/v5/trade/order",
                  path,
                  cdata,
                  tdata[a].apikey,
                  tdata[a].secretkey,
                  tdata[a].passphrase
                );
                if (da1.code === "0") {
                  // const copycre = {
                  //   user_id: uid,
                  //   loan_user_id: uid,
                  //   exchange: tdata[a].exchange,
                  //   trade_pair_id: cthdata.trade_pair_id,
                  //   asset_id: cthdata.asset_id,
                  //   trade_type: cthdata.trade_type,
                  //   ouid: "ouid",
                  //   symbol: cthdata.symbol,
                  //   order_id: da1.data[0].ordId,
                  //   pair: cthdata.pair,
                  //   order_type: cthdata.order_type,
                  //   volume: cthdata.volume,
                  //   leverage: cthdata.leverage,
                  //   price: cthdata.price,
                  //   trade_at: cthdata.trade_at,
                  //   trade_in: "imperial"
                  // };
                  // const tdatas = await copytradehistory.create(copycre);

                  const cpytrdData = new copytradehistory({
                    user_id: uid,
                    loan_user_id: uid,
                    exchange: tdata[a].exchange,
                    trade_pair_id: cthdata.trade_pair_id,
                    asset_id: cthdata.asset_id,
                    trade_type: cthdata.trade_type,
                    ouid: "ouid",
                    symbol: cthdata.symbol,
                    order_id: da1.data[0].ordId,
                    pair: cthdata.pair,
                    order_type: cthdata.order_type,
                    volume: cthdata.volume,
                    leverage: cthdata.leverage,
                    price: cthdata.price,
                    trade_at: cthdata.trade_at,
                    trade_in: "imperial"
                   })
                   cpytrdData.save((err) => {
                     if (err) {
                       buildErrObject(200, err.message)
                     } else{
                       console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                     }
                   })

                }
              }
            } else if (data.orderType === "market") {
              let cdata = {
                instId: data.instId,
                tdMode: data.tdMode,
                ccy: data.ccy,
                tag: data.tag,
                side: data.side,
                ordType: data.orderType,
                sz: data.sz,
              };
              const path = `/api/v5/trade/order${JSON.stringify(cdata)}`;

              const uid = tdata[a].user_id;
              let levdata = JSON.stringify({
                instId: cthdata.pair,
                lever: cthdata.leverage,
                mgnMode: data.tdMode,
              });
              const data1 = await imperialApiAxios(
                "post",
                `https://www.okx.com/api/v5/account/set-leverage`,
                `/api/v5/account/set-leverage${levdata}`,
                levdata,
                tdata[a].apikey,
                tdata[a].secretkey
              );
              if (data1.code === "0") {
                const da1 = await imperialApiAxios(
                  "post",
                  "https://www.okx.com/api/v5/trade/order",
                  path,
                  cdata,
                  tdata[a].apikey,
                  tdata[a].secretkey,
                  tdata[a].passphrase
                );

                if (da1.code === "0") {
                  // const copycre = {
                  //   user_id: uid,
                  //   loan_user_id: uid,
                  //   exchange: tdata[a].exchange,
                  //   trade_pair_id: cthdata.trade_pair_id,
                  //   asset_id: cthdata.asset_id,
                  //   trade_type: cthdata.trade_type,
                  //   ouid: "ouid",
                  //   symbol: cthdata.symbol,
                  //   order_id: da1.data[0].ordId,
                  //   pair: cthdata.pair,
                  //   order_type: cthdata.order_type,
                  //   volume: cthdata.volume,
                  //   leverage: cthdata.leverage,
                  //   price: "0",
                  //   trade_at: cthdata.trade_at,
                  //   trade_in: "imperial"
                  // };
                  // const tdatas = await copytradehistory.create(copycre);

                  const cpytrdData = new copytradehistory({
                    user_id: uid,
                    loan_user_id: uid,
                    exchange: tdata[a].exchange,
                    trade_pair_id: cthdata.trade_pair_id,
                    asset_id: cthdata.asset_id,
                    trade_type: cthdata.trade_type,
                    ouid: "ouid",
                    symbol: cthdata.symbol,
                    order_id: da1.data[0].ordId,
                    pair: cthdata.pair,
                    order_type: cthdata.order_type,
                    volume: cthdata.volume,
                    leverage: cthdata.leverage,
                    price: cthdata.price,
                    trade_at: cthdata.trade_at,
                    trade_in: "imperial"
                   })
                   cpytrdData.save((err) => {
                     if (err) {
                       buildErrObject(200, err.message)
                     } else{
                       console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                     }
                   })

                }
              }
            }
          } 
          else if (data.trade_at === "Margin" && data.tdMode === "cross" && tdata[a].trade_base?.margin && tdata[a].trade_base?.margin) {
            if (data.orderType === "limit") {
              let cdata = {
                instId: data.instId,
                tdMode: data.tdMode,
                ccy: data.ccy,
                tag: data.tag,
                side: data.side,
                ordType: data.orderType,
                sz: data.sz,
                px: data.px,
              };
              const path = `/api/v5/trade/order${JSON.stringify(cdata)}`;

              const uid = tdata[a].user_id;
              let levdata = JSON.stringify({
                instId: cthdata.pair,
                lever: cthdata.leverage,
                mgnMode: data.tdMode,
              });
              const data1 = await imperialApiAxios(
                "post",
                `https://www.okx.com/api/v5/account/set-leverage`,
                `/api/v5/account/set-leverage${levdata}`,
                levdata,
                tdata[a].apikey,
                tdata[a].secretkey
              );
              if (data1.code === "0") {
                const da1 = await imperialApiAxios(
                  "post",
                  "https://www.okx.com/api/v5/trade/order",
                  path,
                  cdata,
                  tdata[a].apikey,
                  tdata[a].secretkey,
                  tdata[a].passphrase
                );
                if (da1.code === "0") {
                  // const copycre = {
                  //   user_id: uid,
                  //   loan_user_id: uid,
                  //   exchange: tdata[a].exchange,
                  //   trade_pair_id: cthdata.trade_pair_id,
                  //   asset_id: cthdata.asset_id,
                  //   trade_type: cthdata.trade_type,
                  //   ouid: "ouid",
                  //   symbol: cthdata.symbol,
                  //   order_id: da1.data[0].ordId,
                  //   pair: cthdata.pair,
                  //   order_type: cthdata.order_type,
                  //   volume: cthdata.volume,
                  //   leverage: cthdata.leverage,
                  //   price: cthdata.price,
                  //   trade_at: cthdata.trade_at,
                  //   trade_in: "imperial"
                  // };
                  // const tdatas = await copytradehistory.create(copycre);

                  const cpytrdData = new copytradehistory({
                    user_id: uid,
                    loan_user_id: uid,
                    exchange: tdata[a].exchange,
                    trade_pair_id: cthdata.trade_pair_id,
                    asset_id: cthdata.asset_id,
                    trade_type: cthdata.trade_type,
                    ouid: "ouid",
                    symbol: cthdata.symbol,
                    order_id: da1.data[0].ordId,
                    pair: cthdata.pair,
                    order_type: cthdata.order_type,
                    volume: cthdata.volume,
                    leverage: cthdata.leverage,
                    price: cthdata.price,
                    trade_at: cthdata.trade_at,
                    trade_in: "imperial"
                   })
                   cpytrdData.save((err) => {
                     if (err) {
                       buildErrObject(200, err.message)
                     } else{
                       console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                     }
                   })

                }
              }
            } else if (data.orderType === "market") {
              console.log('market')
              let cdata = {
                instId: data.instId,
                tdMode: data.tdMode,
                ccy: data.ccy,
                tag: data.tag,
                side: data.side,
                ordType: data.orderType,
                sz: data.sz,
              };
              console.log(cdata, "margin cdata")
              const path = `/api/v5/trade/order${JSON.stringify(cdata)}`;

              const uid = tdata[a].user_id;
              let levdata = JSON.stringify({
                instId: cthdata.pair,
                lever: cthdata.leverage,
                mgnMode: data.tdMode,
              });
              const data1 = await imperialApiAxios(
                "post",
                `https://www.okx.com/api/v5/account/set-leverage`,
                `/api/v5/account/set-leverage${levdata}`,
                levdata,
                tdata[a].apikey,
                tdata[a].secretkey
              );

              if (data1.code === "0") {
                const da1 = await imperialApiAxios(
                  "post",
                  "https://www.okx.com/api/v5/trade/order",
                  path,
                  cdata,
                  tdata[a].apikey,
                  tdata[a].secretkey,
                  tdata[a].passphrase
                );
                console.log(da1, "dataa")
                if (da1.code === "0") {
                  // const copycre = {
                  //   user_id: uid,
                  //   loan_user_id: uid,
                  //   exchange: tdata[a].exchange,
                  //   trade_pair_id: cthdata.trade_pair_id,
                  //   asset_id: cthdata.asset_id,
                  //   trade_type: cthdata.trade_type,
                  //   ouid: "ouid",
                  //   symbol: cthdata.symbol,
                  //   order_id: da1.data[0].ordId,
                  //   pair: cthdata.pair,
                  //   order_type: cthdata.order_type,
                  //   volume: cthdata.volume,
                  //   leverage: cthdata.leverage,
                  //   price: "0",
                  //   trade_at: cthdata.trade_at,
                  //   trade_in: "imperial"
                  // };
                  // const tdatas = await copytradehistory.create(copycre);

                  const cpytrdData = new copytradehistory({
                    user_id: uid,
                      loan_user_id: uid,
                      exchange: tdata[a].exchange,
                      trade_pair_id: cthdata.trade_pair_id,
                      asset_id: cthdata.asset_id,
                      trade_type: cthdata.trade_type,
                      ouid: "ouid",
                      symbol: cthdata.symbol,
                      order_id: da1.data[0].ordId,
                      pair: cthdata.pair,
                      order_type: cthdata.order_type,
                      volume: cthdata.volume,
                      leverage: cthdata.leverage,
                      price: "0",
                      trade_at: cthdata.trade_at,
                      trade_in: "imperial"
                   })
                   cpytrdData.save((err) => {
                     if (err) {
                       buildErrObject(200, err.message)
                     } else{
                       console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                     }
                   })

                }
              }
            }
          } 
          else if (
            (req.trade_at === "future-open-long" ||
              req.trade_at === "future-close-long") && tdata[a].trade_base?.future
          ) {
            const split = req.trade_at.split("-");
            if (split[1] === "open") {
              let datas = JSON.stringify({
                instId: req.instId,
                lever: req.lever,
                mgnMode: req.tdMode,
                posSide: "long",
              });
              const future_data = await imperialApiAxios(
                "post",
                `https://www.okx.comwww.okx.com/api/v5/account/set-leverage`,
                `/api/v5/account/set-leverage${datas}`,
                datas,
                tdata[a].apikey,
                tdata[a].secretkey,
                tdata[a].passphrase
              );
              if (future_data.code === "0") {
                if (futurepair[0]) {
                  if (req.orderType === "market") {
                    let data = JSON.stringify({
                      instId: req.instId,
                      tdMode: req.tdMode,
                      ccy: req.ccy,
                      tag: req.tag,
                      side: req.side,
                      ordType: req.orderType,
                      posSide: "long",
                      sz: req.sz,
                      px: req.px,
                    });

                    var domain = "https://www.okx.com";
                    var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
                    var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
                    var passphrase = "Pass@123";
                    var iosTime = new Date().toISOString();
                    var method = "POST";
                    var textToSign = "";
                    textToSign += iosTime;
                    textToSign += method;
                    textToSign += `/api/v5/trade/order${data}`;

                    var sign = CryptoJS.enc.Base64.stringify(
                      CryptoJS.HmacSHA256(
                        iosTime + "POST" + `/api/v5/trade/order${data}`,
                        tdata[a].secretkey
                      )
                    );

                    let config = {
                      method: "post",
                      maxBodyLength: Infinity,
                      url: `https://www.okx.com/api/v5/trade/order`,
                      headers: {
                        "Content-Type": "application/json",
                        "OK-ACCESS-KEY": tdata[a].apikey,
                        "OK-ACCESS-SIGN": sign,
                        "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
                        "OK-ACCESS-TIMESTAMP": iosTime,
                        "TEXT-TO-SIGN": textToSign,
                        "x-simulated-trading":0,
                        Cookie: "locale=en-US",
                      },
                      data: data,
                    };
                    await axios
                      .request(config)
                      .then(async (ress) => {
                        if (ress.data.code === "0") {
                          // const data = {
                          //   user_id: user._id,
                          //   loan_user_id: user._id,
                          //   trade_pair_id: futurepair[0].data._id,
                          //   asset_id: futurepair[0].data._id,
                          //   trade_type: req.side,
                          //   ouid: "ouid",
                          //   symbol: req.instId.split("-")[0],
                          //   order_id: ress.data.data[0].ordId,
                          //   pair: req.instId,
                          //   order_type: req.orderType,
                          //   volume: Number(req.sz),
                          //   leverage: req.lever,
                          //   trade_at: "future",
                          //   trade_in: "imperial"
                          // };
                          // copTrade(user, req, data)
                          // const tdata = await trade
                          //   .create(data)

                          const cpytrdData = new copytradehistory({
                            user_id: user._id,
                            loan_user_id: user._id,
                            trade_pair_id: futurepair[0].data._id,
                            asset_id: futurepair[0].data._id,
                            trade_type: req.side,
                            ouid: "ouid",
                            symbol: req.instId.split("-")[0],
                            order_id: ress.data.data[0].ordId,
                            pair: req.instId,
                            order_type: req.orderType,
                            volume: Number(req.sz),
                            leverage: req.lever,
                            trade_at: "future",
                            trade_in: "imperial"
                           })
                           cpytrdData.save((err) => {
                             if (err) {
                               buildErrObject(200, err.message)
                             } else{
                               console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                             }
                           })

                            .then((response) =>
                              res.status(200).json({
                                success: true,
                                result: "",
                                message: "Trade Created Successfully",
                              })
                            )
                            .catch((error) =>
                              res.status(400).json({
                                success: false,
                                result: "",
                                message: "Trade Not Created ",
                              })
                            );
                        } else {
                          res.status(400).json({
                            success: false,
                            result: "",
                            message: ress.data.data[0].sMsg,
                          });
                        }
                      })
                      .catch((err) => console.log(err));
                  } else {
                    let data = JSON.stringify({
                      instId: req.instId,
                      tdMode: req.tdMode,
                      ccy: req.ccy,
                      tag: req.tag,
                      side: req.side,
                      posSide: "long",
                      ordType: req.orderType,
                      sz: req.sz,
                      px: req.px,
                    });

                    var domain = "https://www.okx.com";
                    var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
                    var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
                    var passphrase = "Pass@123";
                    var iosTime = new Date().toISOString();
                    var method = "POST";
                    var textToSign = "";
                    textToSign += iosTime;
                    textToSign += method;
                    textToSign += `/api/v5/trade/order${data}`;

                    var sign = CryptoJS.enc.Base64.stringify(
                      CryptoJS.HmacSHA256(
                        iosTime + "POST" + `/api/v5/trade/order${data}`,
                        tdata[a].secretkey
                      )
                    );

                    let config = {
                      method: "post",
                      maxBodyLength: Infinity,
                      url: `https://www.okx.com/api/v5/trade/order`,
                      headers: {
                        "Content-Type": "application/json",
                        "OK-ACCESS-KEY": "93975967-ed47-4070-a436-329e22e14a1b",
                        "OK-ACCESS-SIGN": sign,
                        "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
                        "OK-ACCESS-TIMESTAMP": iosTime,
                        "TEXT-TO-SIGN": textToSign,
                        "x-simulated-trading":0,
                        Cookie: "locale=en-US",
                      },
                      data: data,
                    };
                    console.log('CORRECT COMMIN G**************************8');
                    await axios
                      .request(config)
                      .then(async (ress) => {
                        if (ress.data.code === "0") {
                          // const data = {
                          //   user_id: user._id,
                          //   loan_user_id: user._id,
                          //   trade_pair_id: futurepair[0].data._id,
                          //   asset_id: futurepair[0].data._id,
                          //   trade_type: req.side,
                          //   ouid: "ouid",
                          //   symbol: req.instId.split("-")[0],
                          //   order_id: ress.data.data[0].ordId,
                          //   pair: req.instId,
                          //   order_type: req.orderType,
                          //   price: Number(req.px),
                          //   leverage: req.lever,
                          //   volume: Number(req.sz),
                          //   trade_at: "future",
                          //   trade_in: "imperial"
                          // };
                          // copTrade(user, req, data);
                          // const tdata = await trade
                          //   .create(data)

                          const cpytrdData = new copytradehistory({
                            user_id: user._id,
                            loan_user_id: user._id,
                            trade_pair_id: futurepair[0].data._id,
                            asset_id: futurepair[0].data._id,
                            trade_type: req.side,
                            ouid: "ouid",
                            symbol: req.instId.split("-")[0],
                            order_id: ress.data.data[0].ordId,
                            pair: req.instId,
                            order_type: req.orderType,
                            price: Number(req.px),
                            leverage: req.lever,
                            volume: Number(req.sz),
                            trade_at: "future",
                            trade_in: "imperial"
                           })
                           cpytrdData.save((err) => {
                             if (err) {
                               buildErrObject(200, err.message)
                             } else{
                               console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                             }
                           })

                            .then((response) =>
                              res.status(200).json({
                                success: true,
                                result: "",
                                message: "Trade Created Successfulllllllly",
                              })
                            )
                            .catch((error) =>
                              res.status(400).json({
                                success: false,
                                result: "",
                                message: "Trade Not Created ",
                              })
                            );
                        } else {
                          res.status(400).json({
                            success: false,
                            result: "",
                            message: ress.data.data[0].sMsg,
                          });
                        }
                      })
                      .catch((err) => console.log(err));
                  }
                } else {
                  res.status(400).json({
                    success: false,
                    result: "",
                    message: "Invalid trade pairs",
                  });
                }
              }
            } else {
              // let datas = JSON.stringify({ "instId": req.instId, "lever": req.lever, "mgnMode": req.tdMode, "posSide": "long" })
              // const future_data = await imperialApiAxios('post', `https://www.okx.com/api/v5/account/set-leverage`, `/api/v5/account/set-leverage${datas}`, datas, '93975967-ed47-4070-a436-329e22e14a1b', 'CBB7D9C9B6426A6562D2741A1E8AC9A6')

              if (futurepair[0]) {
                if (req.orderType === "market") {
                  const value = (req.lever / 100) * req.sz;
                  console.log(value, "val");
                  let data = JSON.stringify({
                    instId: req.instId,
                    tdMode: req.tdMode,
                    ccy: req.ccy,
                    tag: req.tag,
                    side: req.side,
                    ordType: req.orderType,
                    posSide: "long",
                    sz: req.lever,
                  });

                  var domain = "https://www.okx.com";
                  var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
                  var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
                  var passphrase = "Pass@123";
                  var iosTime = new Date().toISOString();
                  var method = "POST";
                  var textToSign = "";
                  textToSign += iosTime;
                  textToSign += method;
                  textToSign += `/api/v5/trade/order${data}`;

                  var sign = CryptoJS.enc.Base64.stringify(
                    CryptoJS.HmacSHA256(
                      iosTime + "POST" + `/api/v5/trade/order${data}`,
                      tdata[a].secretkey
                    )
                  );

                  let config = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: `https://www.okx.com/api/v5/trade/order`,
                    headers: {
                      "Content-Type": "application/json",
                      "OK-ACCESS-KEY": tdata[a].apikey,
                      "OK-ACCESS-SIGN": sign,
                      "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
                      "OK-ACCESS-TIMESTAMP": iosTime,
                      "TEXT-TO-SIGN": textToSign,
                      "x-simulated-trading":0,
                      Cookie: "locale=en-US",
                    },
                    data: data,
                  };
                  await axios
                    .request(config)
                    .then(async (ress) => {
                      if (ress.data.code === "0") {
                        // const data = {
                        //   user_id: user._id,
                        //   loan_user_id: user._id,
                        //   trade_pair_id: futurepair[0]._id,
                        //   asset_id: futurepair[0]._id,
                        //   trade_type: req.side,
                        //   ouid: "ouid",
                        //   symbol: req.instId.split("-")[0],
                        //   order_id: ress.data.data[0].ordId,
                        //   pair: req.instId,
                        //   order_type: req.orderType,
                        //   volume: Number(req.sz),
                        //   leverage: req.lever,
                        //   trade_at: "future",
                        //   trade_in: "imperial"
                        // };
                        // copTrade(user, req, data);
                        // const tdata = await trade
                        //   .create(data)

                        const cpytrdData = new copytradehistory({
                          user_id: user._id,
                          loan_user_id: user._id,
                          trade_pair_id: futurepair[0]._id,
                          asset_id: futurepair[0]._id,
                          trade_type: req.side,
                          ouid: "ouid",
                          symbol: req.instId.split("-")[0],
                          order_id: ress.data.data[0].ordId,
                          pair: req.instId,
                          order_type: req.orderType,
                          volume: Number(req.sz),
                          leverage: req.lever,
                          trade_at: "future",
                          trade_in: "imperial"
                         })
                         cpytrdData.save((err) => {
                           if (err) {
                             buildErrObject(200, err.message)
                           } else{
                             console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                           }
                         })

                          .then((response) =>
                            res.status(200).json({
                              success: true,
                              result: "",
                              message: "Trade Created Successfully",
                            })
                          )
                          .catch((error) =>
                            res.status(400).json({
                              success: false,
                              result: "",
                              message: "Trade Not Created ",
                            })
                          );
                      } else {
                        res.status(400).json({
                          success: false,
                          result: "",
                          message: ress.data.data[0].sMsg,
                        });
                      }
                    })
                    .catch((err) => console.log(err));
                } else {
                  const value = (req.lever / 100) * req.sz;
                  console.log(value, "val");
                  let data = JSON.stringify({
                    instId: req.instId,
                    tdMode: req.tdMode,
                    ccy: req.ccy,
                    tag: req.tag,
                    side: req.side,
                    ordType: req.orderType,
                    posSide: "long",
                    sz: req.lever,
                    px: req.px,
                  });

                  var domain = "https://www.okx.com";
                  var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
                  var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
                  var passphrase = "Pass@123";
                  var iosTime = new Date().toISOString();
                  var method = "POST";
                  var textToSign = "";
                  textToSign += iosTime;
                  textToSign += method;
                  textToSign += `/api/v5/trade/order${data}`;

                  var sign = CryptoJS.enc.Base64.stringify(
                    CryptoJS.HmacSHA256(
                      iosTime + "POST" + `/api/v5/trade/order${data}`,
                      tdata[a].secretkey
                    )
                  );

                  let config = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: `https://www.okx.com/api/v5/trade/order`,
                    headers: {
                      "Content-Type": "application/json",
                      "OK-ACCESS-KEY": tdata[a].apikey,
                      "OK-ACCESS-SIGN": sign,
                      "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
                      "OK-ACCESS-TIMESTAMP": iosTime,
                      "TEXT-TO-SIGN": textToSign,
                      "x-simulated-trading":0,
                      Cookie: "locale=en-US",
                    },
                    data: data,
                  };

                  await axios
                    .request(config)
                    .then(async (ress) => {
                      if (ress.data.code === "0") {
                        // const data = {
                        //   user_id: user._id,
                        //   loan_user_id: user._id,
                        //   trade_pair_id: futurepair[0]._id,
                        //   asset_id: futurepair[0]._id,
                        //   trade_type: req.side,
                        //   ouid: "ouid",
                        //   symbol: req.instId.split("-")[0],
                        //   order_id: ress.data.data[0].ordId,
                        //   pair: req.instId,
                        //   order_type: req.orderType,
                        //   price: Number(req.px),
                        //   leverage: req.lever,
                        //   volume: Number(req.sz),
                        //   trade_at: "future",
                        //   trade_in: "imperial"
                        // };
                        // copTrade(user, req, data);
                        // const tdata = await trade
                        //   .create(data)

                        const cpytrdData = new copytradehistory({
                          user_id: user._id,
                          loan_user_id: user._id,
                          trade_pair_id: futurepair[0]._id,
                          asset_id: futurepair[0]._id,
                          trade_type: req.side,
                          ouid: "ouid",
                          symbol: req.instId.split("-")[0],
                          order_id: ress.data.data[0].ordId,
                          pair: req.instId,
                          order_type: req.orderType,
                          price: Number(req.px),
                          leverage: req.lever,
                          volume: Number(req.sz),
                          trade_at: "future",
                          trade_in: "imperial"
                         })
                         cpytrdData.save((err) => {
                           if (err) {
                             buildErrObject(200, err.message)
                           } else{
                             console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                           }
                         })

                          .then((response) =>
                            res.status(200).json({
                              success: true,
                              result: "",
                              message: "Trade Created Successfully",
                            })
                          )
                          .catch((error) =>
                            res.status(400).json({
                              success: false,
                              result: "",
                              message: "Trade Not Created ",
                            })
                          );
                      } else {
                        res.status(400).json({
                          success: false,
                          result: "",
                          message: ress.data.data[0].sMsg,
                        });
                      }
                    })
                    .catch((err) => console.log(err));
                }
              } else {
                res.status(400).json({
                  success: false,
                  result: "",
                  message: "Invalid trade pairs",
                });
              }
            }
            // var iosTime = new Date() / 1000;
            // var sign = CryptoJS.enc.Base64.stringify(
            //   CryptoJS.HmacSHA256(
            //     iosTime + "GET" + `/users/self/verify`,
            //     "CBB7D9C9B6426A6562D2741A1E8AC9A6"
            //   )
            // );
            // console.log(sign, "sign")
            // console.log(iosTime, "time")
          } else if (
            (req.trade_at === "future-open-short" ||
              req.trade_at === "future-close-short") && tdata[a].trade_base?.future
          ) {
            const split = req.trade_at.split("-");
            if (split[1] === "open") {
              let datas = JSON.stringify({
                instId: req.instId,
                lever: req.lever,
                mgnMode: req.tdMode,
                posSide: "short",
              });
              const future_data = await imperialApiAxios(
                "post",
                `https://www.okx.com/api/v5/account/set-leverage`,
                `/api/v5/account/set-leverage${datas}`,
                datas,
                tdata[a].apikey,
                tdata[a].secretkey,
                tdata[a].passphrase
              );
              if (future_data.code === "0") {
                if (futurepair[0]) {
                  if (req.orderType === "market") {
                    const value = (req.lever / 100) * req.sz;
                    let data = JSON.stringify({
                      instId: req.instId,
                      tdMode: req.tdMode,
                      ccy: req.ccy,
                      tag: req.tag,
                      side: req.side,
                      ordType: req.orderType,
                      posSide: "short",
                      sz: req.sz,
                      px: req.px,
                    });

                    var domain = "https://www.okx.com";
                    var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
                    var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
                    var passphrase = "Pass@123";
                    var iosTime = new Date().toISOString();
                    var method = "POST";
                    var textToSign = "";
                    textToSign += iosTime;
                    textToSign += method;
                    textToSign += `/api/v5/trade/order${data}`;

                    var sign = CryptoJS.enc.Base64.stringify(
                      CryptoJS.HmacSHA256(
                        iosTime + "POST" + `/api/v5/trade/order${data}`,
                        tdata[a].secretkey
                      )
                    );

                    let config = {
                      method: "post",
                      maxBodyLength: Infinity,
                      url: `https://www.okx.com/api/v5/trade/order`,
                      headers: {
                        "Content-Type": "application/json",
                        "OK-ACCESS-KEY": tdata[a].apikey,
                        "OK-ACCESS-SIGN": sign,
                        "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
                        "OK-ACCESS-TIMESTAMP": iosTime,
                        "TEXT-TO-SIGN": textToSign,
                        "x-simulated-trading":0,
                        Cookie: "locale=en-US",
                      },
                      data: data,
                    };
                    await axios
                      .request(config)
                      .then(async (ress) => {
                        if (ress.data.code === "0") {
                          // const data = {
                          //   user_id: user._id,
                          //   loan_user_id: user._id,
                          //   trade_pair_id: futurepair[0].data._id,
                          //   asset_id: futurepair[0].data._id,
                          //   trade_type: req.side,
                          //   ouid: "ouid",
                          //   symbol: req.instId.split("-")[0],
                          //   order_id: ress.data.data[0].ordId,
                          //   pair: req.instId,
                          //   order_type: req.orderType,
                          //   volume: Number(req.sz),
                          //   leverage: req.lever,
                          //   trade_at: "future",
                          //   trade_in: "imperial"
                          // };
                          // copTrade(user, req, data)
                          // const tdata = await trade
                          //   .create(data)

                          const cpytrdData = new copytradehistory({
                            user_id: user._id,
                            loan_user_id: user._id,
                            trade_pair_id: futurepair[0].data._id,
                            asset_id: futurepair[0].data._id,
                            trade_type: req.side,
                            ouid: "ouid",
                            symbol: req.instId.split("-")[0],
                            order_id: ress.data.data[0].ordId,
                            pair: req.instId,
                            order_type: req.orderType,
                            volume: Number(req.sz),
                            leverage: req.lever,
                            trade_at: "future",
                            trade_in: "imperial"
                           })
                           cpytrdData.save((err) => {
                             if (err) {
                               buildErrObject(200, err.message)
                             } else{
                               console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                             }
                           })

                            .then((response) =>
                              res.status(200).json({
                                success: true,
                                result: "",
                                message: "Trade Created Successfully",
                              })
                            )
                            .catch((error) =>
                              res.status(400).json({
                                success: false,
                                result: "",
                                message: "Trade Not Created ",
                              })
                            );
                        } else {
                          res.status(400).json({
                            success: false,
                            result: "",
                            message: ress.data.data[0].sMsg,
                          });
                        }
                      })
                      .catch((err) => console.log(err));
                  } else {
                    let data = JSON.stringify({
                      instId: req.instId,
                      tdMode: req.tdMode,
                      ccy: req.ccy,
                      tag: req.tag,
                      side: req.side,
                      posSide: "short",
                      ordType: req.orderType,
                      sz: req.sz,
                      px: req.px,
                    });

                    var domain = "https://www.okx.com";
                    var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
                    var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
                    var passphrase = "Pass@123";
                    var iosTime = new Date().toISOString();
                    var method = "POST";
                    var textToSign = "";
                    textToSign += iosTime;
                    textToSign += method;
                    textToSign += `/api/v5/trade/order${data}`;

                    var sign = CryptoJS.enc.Base64.stringify(
                      CryptoJS.HmacSHA256(
                        iosTime + "POST" + `/api/v5/trade/order${data}`,
                        tdata[a].secretkey
                      )
                    );

                    let config = {
                      method: "post",
                      maxBodyLength: Infinity,
                      url: `https://www.okx.com/api/v5/trade/order`,
                      headers: {
                        "Content-Type": "application/json",
                        "OK-ACCESS-KEY": tdata[a].apikey,
                        "OK-ACCESS-SIGN": sign,
                        "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
                        "OK-ACCESS-TIMESTAMP": iosTime,
                        "TEXT-TO-SIGN": textToSign,
                        "x-simulated-trading":0,
                        Cookie: "locale=en-US",
                      },
                      data: data,
                    };

                    await axios
                      .request(config)
                      .then(async (ress) => {
                        if (ress.data.code === "0") {
                          // const data = {
                          //   user_id: user._id,
                          //   loan_user_id: user._id,
                          //   trade_pair_id: futurepair[0].data._id,
                          //   asset_id: futurepair[0].data._id,
                          //   trade_type: req.side,
                          //   ouid: "ouid",
                          //   symbol: req.instId.split("-")[0],
                          //   order_id: ress.data.data[0].ordId,
                          //   pair: req.instId,
                          //   order_type: req.orderType,
                          //   price: Number(req.px),
                          //   leverage: req.lever,
                          //   volume: Number(req.sz),
                          //   trade_at: "future",
                          //   trade_in: "imperial"
                          // };
                          // copTrade(user, req, data);
                          // const tdata = await trade
                          //   .create(data)

                          const cpytrdData = new copytradehistory({
                            user_id: user._id,
                            loan_user_id: user._id,
                            trade_pair_id: futurepair[0].data._id,
                            asset_id: futurepair[0].data._id,
                            trade_type: req.side,
                            ouid: "ouid",
                            symbol: req.instId.split("-")[0],
                            order_id: ress.data.data[0].ordId,
                            pair: req.instId,
                            order_type: req.orderType,
                            price: Number(req.px),
                            leverage: req.lever,
                            volume: Number(req.sz),
                            trade_at: "future",
                            trade_in: "imperial"
                           })
                           cpytrdData.save((err) => {
                             if (err) {
                               buildErrObject(200, err.message)
                             } else{
                               console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                             }
                           })

                            .then((response) =>
                              res.status(200).json({
                                success: true,
                                result: "",
                                message: "Trade Created Successfully",
                              })
                            )
                            .catch((error) =>
                              res.status(400).json({
                                success: false,
                                result: "",
                                message: "Trade Not Created ",
                              })
                            );
                        } else {
                          res.status(400).json({
                            success: false,
                            result: "",
                            message: ress.data.data[0].sMsg,
                          });
                        }
                      })
                      .catch((err) => console.log(err));
                  }
                } else {
                  res.status(400).json({
                    success: false,
                    result: "",
                    message: "Invalid trade pairs",
                  });
                }
              }
            } else {
              // let datas = JSON.stringify({ "instId": req.instId, "lever": req.lever, "mgnMode": req.tdMode, "posSide": "short" })
              // const future_data = await imperialApiAxios('post', `https://www.okx.com/api/v5/account/set-leverage`, `/api/v5/account/set-leverage${datas}`, datas, '93975967-ed47-4070-a436-329e22e14a1b', 'CBB7D9C9B6426A6562D2741A1E8AC9A6')
              // if (future_data.code === '0') {
              if (futurepair[0]) {
                if (req.orderType === "market") {
                  let data = JSON.stringify({
                    instId: req.instId,
                    tdMode: req.tdMode,
                    ccy: req.ccy,
                    tag: req.tag,
                    side: req.side,
                    ordType: req.orderType,
                    posSide: "short",
                    sz: req.lever,
                  });

                  var domain = "https://www.okx.com";
                  var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
                  var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
                  var passphrase = tdata[a].passphrase;
                  var iosTime = new Date().toISOString();
                  var method = "POST";
                  var textToSign = "";
                  textToSign += iosTime;
                  textToSign += method;
                  textToSign += `/api/v5/trade/order${data}`;

                  var sign = CryptoJS.enc.Base64.stringify(
                    CryptoJS.HmacSHA256(
                      iosTime + "POST" + `/api/v5/trade/order${data}`,
                      tdata[a].secretkey
                    )
                  );

                  let config = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: `https://www.okx.com/api/v5/trade/order`,
                    headers: {
                      "Content-Type": "application/json",
                      "OK-ACCESS-KEY": tdata[a].apikey,
                      "OK-ACCESS-SIGN": sign,
                      "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
                      "OK-ACCESS-TIMESTAMP": iosTime,
                      "TEXT-TO-SIGN": textToSign,
                      "x-simulated-trading":0,
                      Cookie: "locale=en-US",
                    },
                    data: data,
                  };
                  await axios
                    .request(config)
                    .then(async (ress) => {
                      if (ress.data.code === "0") {
                        // const data = {
                        //   user_id: user._id,
                        //   loan_user_id: user._id,
                        //   trade_pair_id: futurepair[0]._id,
                        //   asset_id: futurepair[0]._id,
                        //   trade_type: req.side,
                        //   ouid: "ouid",
                        //   symbol: req.instId.split("-")[0],
                        //   order_id: ress.data.data[0].ordId,
                        //   pair: req.instId,
                        //   order_type: req.orderType,
                        //   volume: Number(req.sz),
                        //   leverage: req.lever,
                        //   trade_at: "future",
                        //   trade_in: "imperial"
                        // };
                        // copTrade(user, req, data);
                        // const tdata = await trade
                        //   .create(data)

                        const cpytrdData = new copytradehistory({
                          user_id: user._id,
                          loan_user_id: user._id,
                          trade_pair_id: futurepair[0]._id,
                          asset_id: futurepair[0]._id,
                          trade_type: req.side,
                          ouid: "ouid",
                          symbol: req.instId.split("-")[0],
                          order_id: ress.data.data[0].ordId,
                          pair: req.instId,
                          order_type: req.orderType,
                          volume: Number(req.sz),
                          leverage: req.lever,
                          trade_at: "future",
                          trade_in: "imperial"
                         })
                         cpytrdData.save((err) => {
                           if (err) {
                             buildErrObject(200, err.message)
                           } else{
                             console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                           }
                         })                        

                          .then((response) =>
                            res.status(200).json({
                              success: true,
                              result: "",
                              message: "Trade Created Successfully",
                            })
                          )
                          .catch((error) =>
                            res.status(400).json({
                              success: false,
                              result: "",
                              message: "Trade Not Created ",
                            })
                          );
                      } else {
                        res.status(400).json({
                          success: false,
                          result: "",
                          message: ress.data.data[0].sMsg,
                        });
                      }
                    })
                    .catch((err) => console.log(err));
                } else {
                  let data = JSON.stringify({
                    instId: req.instId,
                    tdMode: req.tdMode,
                    ccy: req.ccy,
                    tag: req.tag,
                    side: req.side,
                    ordType: req.orderType,
                    posSide: "short",
                    sz: req.lever,
                    px: req.px,
                  });

                  var domain = "https://www.okx.com";
                  var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
                  var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
                  var passphrase = "Pass@123";
                  var iosTime = new Date().toISOString();
                  var method = "POST";
                  var textToSign = "";
                  textToSign += iosTime;
                  textToSign += method;
                  textToSign += `/api/v5/trade/order${data}`;

                  var sign = CryptoJS.enc.Base64.stringify(
                    CryptoJS.HmacSHA256(
                      iosTime + "POST" + `/api/v5/trade/order${data}`,
                      tdata[a].secretkey
                    )
                  );

                  let config = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: `https://www.okx.com/api/v5/trade/order`,
                    headers: {
                      "Content-Type": "application/json",
                      "OK-ACCESS-KEY": tdata[a].apikey,
                      "OK-ACCESS-SIGN": sign,
                      "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
                      "OK-ACCESS-TIMESTAMP": iosTime,
                      "TEXT-TO-SIGN": textToSign,
                      "x-simulated-trading":0,
                      Cookie: "locale=en-US",
                    },
                    data: data,
                  };

                  await axios
                    .request(config)
                    .then(async (ress) => {
                      if (ress.data.code === "0") {
                        // const data = {
                        //   user_id: user._id,
                        //   loan_user_id: user._id,
                        //   trade_pair_id: futurepair[0]._id,
                        //   asset_id: futurepair[0]._id,
                        //   trade_type: req.side,
                        //   ouid: "ouid",
                        //   symbol: req.instId.split("-")[0],
                        //   order_id: ress.data.data[0].ordId,
                        //   pair: req.instId,
                        //   order_type: req.orderType,
                        //   price: Number(req.px),
                        //   leverage: req.lever,
                        //   volume: Number(req.sz),
                        //   trade_at: "future",
                        //   trade_in: "imperial"
                        // };
                        // copTrade(user, req, data);
                        // const tdata = await trade
                        //   .create(data)

                        const cpytrdData = new copytradehistory({
                          user_id: user._id,
                          loan_user_id: user._id,
                          trade_pair_id: futurepair[0]._id,
                          asset_id: futurepair[0]._id,
                          trade_type: req.side,
                          ouid: "ouid",
                          symbol: req.instId.split("-")[0],
                          order_id: ress.data.data[0].ordId,
                          pair: req.instId,
                          order_type: req.orderType,
                          price: Number(req.px),
                          leverage: req.lever,
                          volume: Number(req.sz),
                          trade_at: "future",
                          trade_in: "imperial"
                         })
                         cpytrdData.save((err) => {
                           if (err) {
                             buildErrObject(200, err.message)
                           } else{
                             console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                           }
                         })

                          .then((response) =>
                            res.status(200).json({
                              success: true,
                              result: "",
                              message: "Trade Created Successfully",
                            })
                          )
                          .catch((error) =>
                            res.status(400).json({
                              success: false,
                              result: "",
                              message: "Trade Not Created ",
                            })
                          );
                      } else {
                        res.status(400).json({
                          success: false,
                          result: "",
                          message: ress.data.data[0].sMsg,
                        });
                      }
                    })
                    .catch((err) => console.log(err));
                }
              } else {
                res.status(400).json({
                  success: false,
                  result: "",
                  message: "Invalid trade pairs",
                });
              }
            }
            // }
            // var iosTime = new Date() / 1000;
            // var sign = CryptoJS.enc.Base64.stringify(
            //   CryptoJS.HmacSHA256(
            //     iosTime + "GET" + `/users/self/verify`,
            //     "CBB7D9C9B6426A6562D2741A1E8AC9A6"
            //   )
            // );
            // console.log(sign, "sign")
            // console.log(iosTime, "time")
          }
        } else if (tdata[a].exchange == "okx") {
          console.log('INITIATING OKC COPY TRADE ********************************');
          if (tdata[a].trade_base?.spot == true && req.trade_at == "spot") {
            console.log('trade_base?.spot == TRUE');
            if (data.orderType === "market") {
              console.log('MARKET TRADING ********************************');
              let cdata = {
                instId: data.instId,
                tdMode: data.tdMode,
                ccy: data.ccy,
                tag: data.tag,
                side: data.side,
                ordType: data.orderType,
                sz: data.sz,
              };

              const path = `/api/v5/trade/order${JSON.stringify(cdata)}`;

              const uid = tdata[a].user_id;
              const da = await imperialApiAxios(
                "post",
                "https://www.okx.com/api/v5/trade/order",
                path,
                cdata,
                tdata[a].apikey,
                tdata[a].secretkey,
                tdata[a].passphrase
              );
              if (da.code === "0") {
                console.log('CODE === 0');
                // let data = {
                //   user_id: uid,
                //   loan_user_id: uid,
                //   exchange: tdata[a].exchange,
                //   trade_pair_id: cthdata.trade_pair_id,
                //   asset_id: cthdata.asset_id,
                //   trade_type: cthdata.trade_type,
                //   ouid: "ouid",
                //   symbol: cthdata.symbol,
                //   order_id: da.data[0].ordId,
                //   pair: cthdata.pair,
                //   order_type: cthdata.order_type,
                //   volume: cthdata.volume,
                //   leverage: "0",
                //   trade_at: cthdata.trade_at,
                //   entry_price: data.orderType == "market" ? data.market : cthdata.px,
                //   entry_price: data.orderType == "market" ? data.market : cthdata.px,
                //   trade_in: "okx"
                // };
                // const tdatas = await copytradehistory.create(data);

                const cpytrdData = new copytradehistory({
                  user_id: uid,
                  loan_user_id: uid,
                  exchange: tdata[a].exchange,
                  trade_pair_id: cthdata.trade_pair_id,
                  asset_id: cthdata.asset_id,
                  trade_type: cthdata.trade_type,
                  ouid: "ouid",
                  symbol: cthdata.symbol,
                  order_id: da.data[0].ordId,
                  pair: cthdata.pair,
                  order_type: cthdata.order_type,
                  volume: cthdata.volume,
                  leverage: "0",
                  trade_at: cthdata.trade_at,
                  entry_price: data.orderType == "market" ? data.market : cthdata.px,
                  entry_price: data.orderType == "market" ? data.market : cthdata.px,
                  trade_in: "okx",
                })
                cpytrdData.save((err) => {
                  if (err) {
                    buildErrObject(200, err.message)
                  }
                  console.log('TRADE DATAS SAVED SUCCESSFULLY ');
                })

              }
            } else if (data.orderType === "limit") {
              console.log('COPY TRADE OF LIMIT ********************************');
              let cdata = {
                instId: data.instId,
                tdMode: data.tdMode,
                // ccy: data.ccy,
                // tag: data.tag,
                side: data.side,
                ordType: data.orderType,
                sz: data.sz,
                px: data.px,
              };
              const path = `/api/v5/trade/order${JSON.stringify(cdata)}`;
              console.log(cdata,path,'********************************');
              const uid = tdata[a].user_id;
              const da = await imperialApiAxios(
                "post",
                "https://www.okx.com/api/v5/trade/order",
                path,
                cdata,
                tdata[a].apikey,
                tdata[a].secretkey,
                tdata[a].passphrase
              );
              console.log(da,da.code,'************************************************************************************************');
              if (da.code == "0") {
                console.log('CODE == 0 STARTS SAVING');
                // const data = {
                //   user_id: uid,
                //   loan_user_id: uid,
                //   exchange: tdata[a].exchange,
                //   trade_pair_id: cthdata.trade_pair_id,
                //   asset_id: cthdata.asset_id,
                //   trade_type: cthdata.trade_type,
                //   ouid: "ouid",
                //   symbol: cthdata.symbol,
                //   order_id: da.data[0].ordId,
                //   pair: cthdata.pair,
                //   order_type: cthdata.order_type,
                //   volume: cthdata.volume,
                //   price: cthdata.price,
                //   leverage: "0",
                //   trade_at: cthdata.trade_at,
                //   entry_price: data.orderType == "market" ? data.market : cthdata.px,
                //   entry_price: data.orderType == "market" ? data.market : cthdata.px,
                //   trade_in: "okx"
                // };
                // console.log(data,"DATAS TO STORE IN COPY TRADE HISTORYS");

                // const tdatas = await copytradehistory.create(data);

                const cpytrdData = new copytradehistory({

                  user_id: uid,
                  loan_user_id: uid,
                  exchange: tdata[a].exchange,
                  trade_pair_id: cthdata.trade_pair_id,
                  asset_id: cthdata.asset_id,
                  trade_type: cthdata.trade_type,
                  ouid: "ouid",
                  symbol: cthdata.symbol,
                  order_id: da.data[0].ordId,
                  pair: cthdata.pair,
                  order_type: cthdata.order_type,
                  volume: cthdata.volume,
                  price: cthdata.price,
                  leverage: "0",
                  trade_at: cthdata.trade_at,
                  entry_price: data.orderType == "market" ? data.market : cthdata.px,
                  entry_price: data.orderType == "market" ? data.market : cthdata.px,
                  trade_in: "okx"

                })
                cpytrdData.save((err, item) => {
                  if (err) {
                    buildErrObject(200, err.message)
                  }
                  console.log('TRADE DATAS SAVED SUCCESSFULLY ');
                })
                
                // if(tdatas){
                //   console.log('TRADE DATAS SAVED SUCCESSFULLY ');
                // }else{
                //   console.log('FAILED !!!!!!!! ');
                // }

              }
            }
          } else if (data.trade_at === "Margin" && data.tdMode === "isolated" && tdata[a].trade_base?.margin) {
            if (data.orderType === "limit") {
              let cdata = {
                instId: data.instId,
                tdMode: data.tdMode,
                ccy: data.ccy,
                tag: data.tag,
                side: data.side,
                ordType: data.orderType,
                sz: data.sz,
                px: data.px,
              };
              const path = `/api/v5/trade/order${JSON.stringify(cdata)}`;

              const uid = tdata[a].user_id;
              let levdata = JSON.stringify({
                instId: cthdata.pair,
                lever: cthdata.leverage,
                mgnMode: data.tdMode,
              });
              const data1 = await imperialApiAxios(
                "post",
                `https://www.okx.com/api/v5/account/set-leverage`,
                `/api/v5/account/set-leverage${levdata}`,
                levdata,
                tdata[a].apikey,
                tdata[a].secretkey
              );
              if (data1.code === "0") {
                const da1 = await imperialApiAxios(
                  "post",
                  "https://www.okx.com/api/v5/trade/order",
                  path,
                  cdata,
                  tdata[a].apikey,
                  tdata[a].secretkey,
                  tdata[a].passphrase
                );
                if (da1.code === "0") {
                  // const copycre = {
                  //   user_id: uid,
                  //   loan_user_id: uid,
                  //   exchange: tdata[a].exchange,
                  //   trade_pair_id: cthdata.trade_pair_id,
                  //   asset_id: cthdata.asset_id,
                  //   trade_type: cthdata.trade_type,
                  //   ouid: "ouid",
                  //   symbol: cthdata.symbol,
                  //   order_id: da1.data[0].ordId,
                  //   pair: cthdata.pair,
                  //   order_type: cthdata.order_type,
                  //   volume: cthdata.volume,
                  //   leverage: cthdata.leverage,
                  //   price: cthdata.price,
                  //   trade_at: cthdata.trade_at,
                  //   trade_in: "okx"
                  // };

                  // const tdatas = await copytradehistory.create(copycre);

                  const cpytrdData = new copytradehistory({
                    user_id: uid,
                    loan_user_id: uid,
                    exchange: tdata[a].exchange,
                    trade_pair_id: cthdata.trade_pair_id,
                    asset_id: cthdata.asset_id,
                    trade_type: cthdata.trade_type,
                    ouid: "ouid",
                    symbol: cthdata.symbol,
                    order_id: da1.data[0].ordId,
                    pair: cthdata.pair,
                    order_type: cthdata.order_type,
                    volume: cthdata.volume,
                    leverage: cthdata.leverage,
                    price: cthdata.price,
                    trade_at: cthdata.trade_at,
                    trade_in: "okx"
  
                  })
                  cpytrdData.save((err) => {
                    if (err) {
                      buildErrObject(200, err.message)
                    }
                    console.log('TRADE DATAS SAVED SUCCESSFULLY ');
                  })

                }
              }
            } else if (data.orderType === "market") {
              let cdata = {
                instId: data.instId,
                tdMode: data.tdMode,
                ccy: data.ccy,
                tag: data.tag,
                side: data.side,
                ordType: data.orderType,
                sz: data.sz,
              };
              const path = `/api/v5/trade/order${JSON.stringify(cdata)}`;

              const uid = tdata[a].user_id;
              let levdata = JSON.stringify({
                instId: cthdata.pair,
                lever: cthdata.leverage,
                mgnMode: data.tdMode,
              });
              const data1 = await imperialApiAxios(
                "post",
                `https://www.okx.com/api/v5/account/set-leverage`,
                `/api/v5/account/set-leverage${levdata}`,
                levdata,
                tdata[a].apikey,
                tdata[a].secretkey
              );
              if (data1.code === "0") {
                const da1 = await imperialApiAxios(
                  "post",
                  "https://www.okx.com/api/v5/trade/order",
                  path,
                  cdata,
                  tdata[a].apikey,
                  tdata[a].secretkey,
                  tdata[a].passphrase
                );

                if (da1.code === "0") {
                  // const copycre = {
                  //   user_id: uid,
                  //   loan_user_id: uid,
                  //   exchange: tdata[a].exchange,
                  //   trade_pair_id: cthdata.trade_pair_id,
                  //   asset_id: cthdata.asset_id,
                  //   trade_type: cthdata.trade_type,
                  //   ouid: "ouid",
                  //   symbol: cthdata.symbol,
                  //   order_id: da1.data[0].ordId,
                  //   pair: cthdata.pair,
                  //   order_type: cthdata.order_type,
                  //   volume: cthdata.volume,
                  //   leverage: cthdata.leverage,
                  //   price: "0",
                  //   trade_at: cthdata.trade_at,
                  //   trade_in: "okx"
                  // };
                  // const tdatas = await copytradehistory.create(copycre);

                  const cpytrdData = new copytradehistory({
                    user_id: uid,
                    loan_user_id: uid,
                    exchange: tdata[a].exchange,
                    trade_pair_id: cthdata.trade_pair_id,
                    asset_id: cthdata.asset_id,
                    trade_type: cthdata.trade_type,
                    ouid: "ouid",
                    symbol: cthdata.symbol,
                    order_id: da1.data[0].ordId,
                    pair: cthdata.pair,
                    order_type: cthdata.order_type,
                    volume: cthdata.volume,
                    leverage: cthdata.leverage,
                    price: "0",
                    trade_at: cthdata.trade_at,
                    trade_in: "okx"
  
                  })
                  cpytrdData.save((err) => {
                    if (err) {
                      buildErrObject(200, err.message)
                    }
                    console.log('TRADE DATAS SAVED SUCCESSFULLY ');
                  })

                }
              }
            }
          } else if (data.trade_at === "Margin" && data.tdMode === "cross" && tdata[a].trade_base?.margin) {
            if (data.orderType === "limit") {
              let cdata = {
                instId: data.instId,
                tdMode: data.tdMode,
                ccy: data.ccy,
                tag: data.tag,
                side: data.side,
                ordType: data.orderType,
                sz: data.sz,
                px: data.px,
              };
              const path = `/api/v5/trade/order${JSON.stringify(cdata)}`;

              const uid = tdata[a].user_id;
              let levdata = JSON.stringify({
                instId: cthdata.pair,
                lever: cthdata.leverage,
                mgnMode: data.tdMode,
              });
              const data1 = await imperialApiAxios(
                "post",
                `https://www.okx.com/api/v5/account/set-leverage`,
                `/api/v5/account/set-leverage${levdata}`,
                levdata,
                tdata[a].apikey,
                tdata[a].secretkey
              );
              if (data1.code === "0") {
                const da1 = await imperialApiAxios(
                  "post",
                  "https://www.okx.com/api/v5/trade/order",
                  path,
                  cdata,
                  tdata[a].apikey,
                  tdata[a].secretkey,
                  tdata[a].passphrase
                );
                if (da1.code === "0") {
                  // const copycre = {
                  //   user_id: uid,
                  //   loan_user_id: uid,
                  //   exchange: tdata[a].exchange,
                  //   trade_pair_id: cthdata.trade_pair_id,
                  //   asset_id: cthdata.asset_id,
                  //   trade_type: cthdata.trade_type,
                  //   ouid: "ouid",
                  //   symbol: cthdata.symbol,
                  //   order_id: da1.data[0].ordId,
                  //   pair: cthdata.pair,
                  //   order_type: cthdata.order_type,
                  //   volume: cthdata.volume,
                  //   leverage: cthdata.leverage,
                  //   price: cthdata.price,
                  //   trade_at: cthdata.trade_at,
                  //   trade_in: "okx"
                  // };
                  // const tdatas = await copytradehistory.create(copycre);

                  const cpytrdData = new copytradehistory({
                    user_id: uid,
                    loan_user_id: uid,
                    exchange: tdata[a].exchange,
                    trade_pair_id: cthdata.trade_pair_id,
                    asset_id: cthdata.asset_id,
                    trade_type: cthdata.trade_type,
                    ouid: "ouid",
                    symbol: cthdata.symbol,
                    order_id: da1.data[0].ordId,
                    pair: cthdata.pair,
                    order_type: cthdata.order_type,
                    volume: cthdata.volume,
                    leverage: cthdata.leverage,
                    price: cthdata.price,
                    trade_at: cthdata.trade_at,
                    trade_in: "okx"
  
                  })
                  cpytrdData.save((err) => {
                    if (err) {
                      buildErrObject(200, err.message)
                    }
                    console.log('TRADE DATAS SAVED SUCCESSFULLY ');
                  })

                }
              }
            } else if (data.orderType === "market") {
              let cdata = {
                instId: data.instId,
                tdMode: data.tdMode,
                ccy: data.ccy,
                tag: data.tag,
                side: data.side,
                ordType: data.orderType,
                sz: data.sz,
              };
              const path = `/api/v5/trade/order${JSON.stringify(cdata)}`;

              const uid = tdata[a].user_id;
              let levdata = JSON.stringify({
                instId: cthdata.pair,
                lever: cthdata.leverage,
                mgnMode: data.tdMode,
              });
              const data1 = await imperialApiAxios(
                "post",
                `https://www.okx.com/api/v5/account/set-leverage`,
                `/api/v5/account/set-leverage${levdata}`,
                levdata,
                tdata[a].apikey,
                tdata[a].secretkey
              );
              if (data1.code === "0") {
                const da1 = await imperialApiAxios(
                  "post",
                  "https://www.okx.com/api/v5/trade/order",
                  path,
                  cdata,
                  tdata[a].apikey,
                  tdata[a].secretkey,
                  tdata[a].passphrase
                );
                if (da1.code === "0") {
                  // const copycre = {
                  //   user_id: uid,
                  //   loan_user_id: uid,
                  //   exchange: tdata[a].exchange,
                  //   trade_pair_id: cthdata.trade_pair_id,
                  //   asset_id: cthdata.asset_id,
                  //   trade_type: cthdata.trade_type,
                  //   ouid: "ouid",
                  //   symbol: cthdata.symbol,
                  //   order_id: da1.data[0].ordId,
                  //   pair: cthdata.pair,
                  //   order_type: cthdata.order_type,
                  //   volume: cthdata.volume,
                  //   leverage: cthdata.leverage,
                  //   price: "0",
                  //   trade_at: cthdata.trade_at,
                  //   trade_in: "okx"
                  // };
                  // const tdatas = await copytradehistory.create(copycre);

                  const cpytrdData = new copytradehistory({
                    user_id: uid,
                    loan_user_id: uid,
                    exchange: tdata[a].exchange,
                    trade_pair_id: cthdata.trade_pair_id,
                    asset_id: cthdata.asset_id,
                    trade_type: cthdata.trade_type,
                    ouid: "ouid",
                    symbol: cthdata.symbol,
                    order_id: da1.data[0].ordId,
                    pair: cthdata.pair,
                    order_type: cthdata.order_type,
                    volume: cthdata.volume,
                    leverage: cthdata.leverage,
                    price: "0",
                    trade_at: cthdata.trade_at,
                    trade_in: "okx"
  
                  })
                  cpytrdData.save((err) => {
                    if (err) {
                      buildErrObject(200, err.message)
                    }
                    console.log('TRADE DATAS SAVED SUCCESSFULLY ');
                  })

                }
              }
            }
          } else if (
            (req.trade_at === "future-open-long" ||
              req.trade_at === "future-close-long") && tdata[a].trade_base?.future
          ) {
            console.log('FUTURE TRADE INITIATED');
            const split = req.trade_at.split("-");
            if (split[1] === "open") {
              let datas;
              if(req.tdMode == 'cross'){
                 datas = JSON.stringify({
                  instId: req.instId,
                  lever: req.lever,
                  mgnMode: req.tdMode,
                  // posSide: "long",
                });
              }else if (req.tdMode == 'isolated') {
                datas = JSON.stringify({
                  instId: req.instId,
                  lever: req.lever,
                  mgnMode: req.tdMode,
                  posSide: "long",
                });
              }
              
              // console.log(datas,'DATAS');
              const future_data = await imperialApiAxios(
                "post",
                `https://www.okx.com/api/v5/account/set-leverage`,
                `/api/v5/account/set-leverage${datas}`,
                datas,
                tdata[a].apikey,
                tdata[a].secretkey,
                tdata[a].passphrase
              );
              console.log(future_data,'FUTURE TRADE RESULT');
              if (future_data.code == "0") {
                console.log("CODE == 0")
                // if (futurepair[0]) {
                  if (req.orderType === "market") {
                    console.log('MARKET TRADE FUTURE');
                    let data = JSON.stringify({
                      instId: req.instId,
                      tdMode: req.tdMode,
                      ccy: req.ccy,
                      tag: req.tag,
                      side: req.side,
                      ordType: req.orderType,
                      posSide: "long",
                      sz: req.sz,
                      px: req.px,
                      lever: req.lever
                    });

                    // var domain = "https://www.okx.com";
                    // var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
                    // var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
                    // var passphrase = "Pass@123";
                    var iosTime = new Date().toISOString();
                    var method = "POST";
                    var textToSign = "";
                    textToSign += iosTime;
                    textToSign += method;
                    textToSign += `/api/v5/trade/order${data}`;

                    var sign = CryptoJS.enc.Base64.stringify(
                      CryptoJS.HmacSHA256(
                        iosTime + "POST" + `/api/v5/trade/order${data}`,
                        tdata[a].secretkey
                      )
                    );

                    let config = {
                      method: "post",
                      maxBodyLength: Infinity,
                      url: `https://www.okx.com/api/v5/trade/order`,
                      headers: {
                        "Content-Type": "application/json",
                        "OK-ACCESS-KEY": tdata[a].apikey,
                        "OK-ACCESS-SIGN": sign,
                        "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
                        "OK-ACCESS-TIMESTAMP": iosTime,
                        "TEXT-TO-SIGN": textToSign,
                        "x-simulated-trading":0,
                        Cookie: "locale=en-US",
                      },
                      data: data,
                    };
                    // await axios
                    //   .request(config)
                    //   .then(async (ress) => {


                    const ress = await imperialApiAxios(
                      "post",
                      `https://www.okx.com/api/v5/trade/order`,
                      `/api/v5/trade/order${data}`,
                      data,
                      tdata[a].apikey ? tdata[a].apikey : "93975967-ed47-4070-a436-329e22e14a1b",
                      tdata[a].secretkey,
                      tdata[a].passphrase
                    )

                        if (ress.data.code == "0") {
                          // const data = {
                          //   user_id: user._id,
                          //   loan_user_id: user._id,
                          //   trade_pair_id: futurepair[0].data._id,
                          //   asset_id: futurepair[0].data._id,
                          //   trade_type: req.side,
                          //   ouid: "ouid",
                          //   symbol: req.instId.split("-")[0],
                          //   order_id: ress.data.data[0].ordId,
                          //   pair: req.instId,
                          //   order_type: req.orderType,
                          //   volume: Number(req.sz),
                          //   leverage: req.lever,
                          //   trade_at: "future",
                          //   trade_in: "okx"
                          // };
                          
                          // copTrade(user, req, data)
                          
                          // const tdata = await trade
                          //   .create(data)


                            const cpytrdData = new copytradehistory({
                              user_id: uid,
                              loan_user_id: uid,
                              exchange: tdata[a].exchange,
                              trade_pair_id: cthdata.trade_pair_id,
                              asset_id: cthdata.asset_id,
                              trade_type: cthdata.trade_type,
                              ouid: "ouid",
                              symbol: cthdata.symbol,
                              order_id: da.data[0].ordId,
                              pair: cthdata.pair,
                              order_type: cthdata.order_type,
                              volume: cthdata.volume,
                              leverage: "0",
                              trade_at: cthdata.trade_at,
                              entry_price: data.orderType == "market" ? data.market : cthdata.px,
                              entry_price: data.orderType == "market" ? data.market : cthdata.px,
                              trade_in: "okx",
                            })
                            cpytrdData.save((err) => {
                              if (err) {
                                buildErrObject(200, err.message)
                              }
                              console.log('TRADE DATAS SAVED SUCCESSFULLY ');
                            })

                            
                            // .then((ress) =>
                            //   res.status(200).json({
                            //     success: true,
                            //     result: "",
                            //     message: "Trade Created Successfully",
                            //   })
                            // )
                            // .catch((err) =>
                            //   res.status(400).json({
                            //     success: false,
                            //     result: "",
                            //     message: "Trade Not Created ",
                            //   })
                            // );
                        } 
                        // else {
                        //   res.status(400).json({
                        //     success: false,
                        //     result: "",
                        //     message: ress.data.data[0].sMsg,
                        //   });
                        // }
                      }  else {
                        console.log('FUTURE ELSE LINE LIMIT')
                        let data = JSON.stringify({
                          instId: req.instId,
                          tdMode: req.tdMode,
                          ccy: req.ccy,
                          tag: req.tag,
                          side: req.side,
                          posSide: "long",
                          ordType: req.orderType,
                          sz: req.sz,
                          px: req.px,
                        });
    
                        // var domain = "https://www.okx.com";
                        // var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
                        // var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
                        // var passphrase = "Pass@123";
                        var iosTime = new Date().toISOString();
                        var method = "POST";
                        var textToSign = "";
                        textToSign += iosTime;
                        textToSign += method;
                        textToSign += `/api/v5/trade/order${data}`;
    
                        var sign = CryptoJS.enc.Base64.stringify(
                          CryptoJS.HmacSHA256(
                            iosTime + "POST" + `/api/v5/trade/order${data}`,
                            tdata[a].secretkey
                          )
                        );
    
                        let config = {
                          method: "post",
                          maxBodyLength: Infinity,
                          url: `https://www.okx.com/api/v5/trade/order`,
                          headers: {
                            "Content-Type": "application/json",
                            "OK-ACCESS-KEY": tdata[a].apikey ? tdata[a].apikey : "93975967-ed47-4070-a436-329e22e14a1b",
                            "OK-ACCESS-SIGN": sign,
                            "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
                            "OK-ACCESS-TIMESTAMP": iosTime,
                            "TEXT-TO-SIGN": textToSign,
                            "x-simulated-trading":0,
                            Cookie: "locale=en-US",
                          },
                          data: data,
                        };
                        console.log(config,'sending AXIOSSSSSSS');
                        // await axios
                        //   .request(config)
                        //   .then( (response) => {
                        //     console.log(response,'RESPONSEEEE OF THE AXOISSSSSSSSS');
    
                        const response = await imperialApiAxios(
                          "post",
                          `https://www.okx.com/api/v5/trade/order`,
                          `/api/v5/trade/order${data}`,
                          data,
                          tdata[a].apikey ? tdata[a].apikey : "93975967-ed47-4070-a436-329e22e14a1b",
                          tdata[a].secretkey,
                          tdata[a].passphrase
                        )
                          console.log(response,'RESPONSE OF TRADE FUTRRE');
                            if (response.code == "0") {
                              console.log("FUTRRE TRADE COMPLETED");
                              // const data = {
                              //   user_id: user._id,
                              //   loan_user_id: user._id,
                              //   trade_pair_id: futurepair[0].data._id,
                              //   asset_id: futurepair[0].data._id,
                              //   trade_type: req.side,
                              //   ouid: "ouid",
                              //   symbol: req.instId.split("-")[0],
                              //   order_id: ress.data.data[0].ordId,
                              //   pair: req.instId,
                              //   order_type: req.orderType,
                              //   price: Number(req.px),
                              //   leverage: req.lever,
                              //   volume: Number(req.sz),
                              //   trade_at: "future",
                              //   trade_in: "okx"
                              // };
                              // copTrade(user, req, data);
                              // const tdata = trade
                              //   .create(data)
    
    
                                const cpytrdData = new copytradehistory({
                                 user_id: user._id,
                                loan_user_id: user._id,
                                trade_pair_id: futurepair[0].data._id,
                                asset_id: futurepair[0].data._id,
                                trade_type: req.side,
                                ouid: "ouid",
                                symbol: req.instId.split("-")[0],
                                order_id: ress.data.data[0].ordId,
                                pair: req.instId,
                                order_type: req.orderType,
                                price: Number(req.px),
                                leverage: req.lever,
                                volume: Number(req.sz),
                                trade_at: "future",
                                trade_in: "okx"
                                })
                                cpytrdData.save((err) => {
                                  if (err) {
                                    buildErrObject(200, err.message)
                                  } else{
                                    console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                                  }
                                })
    
    
                                // .then((ress) =>
                                //   res.status(200).json({
                                //     success: true,
                                //     result: "",
                                //     message: "Trade Created Successfully",
                                //   })
                                // )
                                // .catch((error) =>
                                //   res.status(400).json({
                                //     success: false,
                                //     result: "",
                                //     message: "Trade Not Created ",
                                //   })
                                // );
                            } 
                          // })
                          // .catch((err) => console.log(err));
                      }

                      // )
                      // .catch((err) => console.log(err));
                  }
                  
                // } else {
                //   res.status(400).json({
                //     success: false,
                //     result: "",
                //     message: "Invalid trade pairs",
                //   });
                // }
              }
            } else {
              // let datas = JSON.stringify({ "instId": req.instId, "lever": req.lever, "mgnMode": req.tdMode, "posSide": "long" })
              // const future_data = await imperialApiAxios('post', `https://www.okx.com/api/v5/account/set-leverage`, `/api/v5/account/set-leverage${datas}`, datas, '93975967-ed47-4070-a436-329e22e14a1b', 'CBB7D9C9B6426A6562D2741A1E8AC9A6')

              if (futurepair[0]) {
                if (req.orderType === "market") {
                  const value = (req.lever / 100) * req.sz;
                  console.log(value, "val");
                  let data = JSON.stringify({
                    instId: req.instId,
                    tdMode: req.tdMode,
                    ccy: req.ccy,
                    tag: req.tag,
                    side: req.side,
                    ordType: req.orderType,
                    posSide: "long",
                    sz: req.lever,
                  });

                  var domain = "https://www.okx.com";
                  var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
                  var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
                  var passphrase = "Pass@123";
                  var iosTime = new Date().toISOString();
                  var method = "POST";
                  var textToSign = "";
                  textToSign += iosTime;
                  textToSign += method;
                  textToSign += `/api/v5/trade/order${data}`;

                  var sign = CryptoJS.enc.Base64.stringify(
                    CryptoJS.HmacSHA256(
                      iosTime + "POST" + `/api/v5/trade/order${data}`,
                      tdata[a].secretkey
                    )
                  );

                  let config = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: `https://www.okx.com/api/v5/trade/order`,
                    headers: {
                      "Content-Type": "application/json",
                      "OK-ACCESS-KEY": tdata[a].apikey,
                      "OK-ACCESS-SIGN": sign,
                      "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
                      "OK-ACCESS-TIMESTAMP": iosTime,
                      "TEXT-TO-SIGN": textToSign,
                      "x-simulated-trading":0,
                      Cookie: "locale=en-US",
                    },
                    data: data,
                  };
                  await axios
                    .request(config)
                    .then(async (ress) => {
                      if (ress.data.code === "0") {
                        // const data = {
                        //   user_id: user._id,
                        //   loan_user_id: user._id,
                        //   trade_pair_id: futurepair[0]._id,
                        //   asset_id: futurepair[0]._id,
                        //   trade_type: req.side,
                        //   ouid: "ouid",
                        //   symbol: req.instId.split("-")[0],
                        //   order_id: ress.data.data[0].ordId,
                        //   pair: req.instId,
                        //   order_type: req.orderType,
                        //   volume: Number(req.sz),
                        //   leverage: req.lever,
                        //   trade_at: "future",
                        //   trade_in: "okx"
                        // };

                        // copTrade(user, req, data);
                        // const tdata = await trade
                        //   .create(data)


                        const cpytrdData = new copytradehistory({
                          user_id: user._id,
                          loan_user_id: user._id,
                          trade_pair_id: futurepair[0]._id,
                          asset_id: futurepair[0]._id,
                          trade_type: req.side,
                          ouid: "ouid",
                          symbol: req.instId.split("-")[0],
                          order_id: ress.data.data[0].ordId,
                          pair: req.instId,
                          order_type: req.orderType,
                          volume: Number(req.sz),
                          leverage: req.lever,
                          trade_at: "future",
                          trade_in: "okx"
                        })
                        cpytrdData.save((err) => {
                          if (err) {
                            buildErrObject(200, err.message)
                          }
                          console.log('TRADE DATAS SAVED SUCCESSFULLY ');
                        })                        

                          .then((response) =>
                            res.status(200).json({
                              success: true,
                              result: "",
                              message: "Trade Created Successfully",
                            })
                          )
                          .catch((error) =>
                            res.status(400).json({
                              success: false,
                              result: "",
                              message: "Trade Not Created ",
                            })
                          );
                      } else {
                        res.status(400).json({
                          success: false,
                          result: "",
                          message: ress.data.data[0].sMsg,
                        });
                      }
                    })
                    .catch((err) => console.log(err));
                } else {
                  const value = (req.lever / 100) * req.sz;
                  console.log(value, "val");
                  let data = JSON.stringify({
                    instId: req.instId,
                    tdMode: req.tdMode,
                    ccy: req.ccy,
                    tag: req.tag,
                    side: req.side,
                    ordType: req.orderType,
                    posSide: "long",
                    sz: req.lever,
                    px: req.px,
                  });

                  var domain = "https://www.okx.com";
                  var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
                  var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
                  var passphrase = "Pass@123";
                  var iosTime = new Date().toISOString();
                  var method = "POST";
                  var textToSign = "";
                  textToSign += iosTime;
                  textToSign += method;
                  textToSign += `/api/v5/trade/order${data}`;

                  var sign = CryptoJS.enc.Base64.stringify(
                    CryptoJS.HmacSHA256(
                      iosTime + "POST" + `/api/v5/trade/order${data}`,
                      tdata[a].secretkey
                    )
                  );

                  let config = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: `https://www.okx.com/api/v5/trade/order`,
                    headers: {
                      "Content-Type": "application/json",
                      "OK-ACCESS-KEY": tdata[a].apikey,
                      "OK-ACCESS-SIGN": sign,
                      "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
                      "OK-ACCESS-TIMESTAMP": iosTime,
                      "TEXT-TO-SIGN": textToSign,
                      "x-simulated-trading":0,
                      Cookie: "locale=en-US",
                    },
                    data: data,
                  };

                  await axios
                    .request(config)
                    .then(async (ress) => {
                      if (ress.data.code === "0") {
                        // const data = {
                        //   user_id: user._id,
                        //   loan_user_id: user._id,
                        //   trade_pair_id: futurepair[0]._id,
                        //   asset_id: futurepair[0]._id,
                        //   trade_type: req.side,
                        //   ouid: "ouid",
                        //   symbol: req.instId.split("-")[0],
                        //   order_id: ress.data.data[0].ordId,
                        //   pair: req.instId,
                        //   order_type: req.orderType,
                        //   price: Number(req.px),
                        //   leverage: req.lever,
                        //   volume: Number(req.sz),
                        //   trade_at: "future",
                        //   trade_in: "okx"
                        // };
                        // copTrade(user, req, data);
                        // const tdata = await trade
                        //   .create(data)


                        const cpytrdData = new copytradehistory({
                          user_id: user._id,
                          loan_user_id: user._id,
                          trade_pair_id: futurepair[0]._id,
                          asset_id: futurepair[0]._id,
                          trade_type: req.side,
                          ouid: "ouid",
                          symbol: req.instId.split("-")[0],
                          order_id: ress.data.data[0].ordId,
                          pair: req.instId,
                          order_type: req.orderType,
                          price: Number(req.px),
                          leverage: req.lever,
                          volume: Number(req.sz),
                          trade_at: "future",
                          trade_in: "okx"
                        })
                        cpytrdData.save((err) => {
                          if (err) {
                            buildErrObject(200, err.message)
                          }
                          console.log('TRADE DATAS SAVED SUCCESSFULLY ');
                        }) 


                          .then((response) =>
                            res.status(200).json({
                              success: true,
                              result: "",
                              message: "Trade Created Successfully",
                            })
                          )
                          .catch((error) =>
                            res.status(400).json({
                              success: false,
                              result: "",
                              message: "Trade Not Created ",
                            })
                          );
                      } else {
                        res.status(400).json({
                          success: false,
                          result: "",
                          message: ress.data.data[0].sMsg,
                        });
                      }
                    })
                    .catch((err) => console.log(err));
                }
              } else {
                res.status(400).json({
                  success: false,
                  result: "",
                  message: "Invalid trade pairs",
                });
              }
            }
            // var iosTime = new Date() / 1000;
            // var sign = CryptoJS.enc.Base64.stringify(
            //   CryptoJS.HmacSHA256(
            //     iosTime + "GET" + `/users/self/verify`,
            //     "CBB7D9C9B6426A6562D2741A1E8AC9A6"
            //   )
            // );
            // console.log(sign, "sign")
            // console.log(iosTime, "time")
          } 
        //   else if (
        //     (req.trade_at === "future-open-short" ||
        //       req.trade_at === "future-close-short") && tdata[a].trade_base?.future
        //   ) {
        //     const split = req.trade_at.split("-");
        //     if (split[1] === "open") {
        //       let datas = JSON.stringify({
        //         instId: req.instId,
        //         lever: req.lever,
        //         mgnMode: req.tdMode,
        //         posSide: "short",
        //       });
        //       const future_data = await imperialApiAxios(
        //         "post",
        //         `https://www.okx.com/api/v5/account/set-leverage`,
        //         `/api/v5/account/set-leverage${datas}`,
        //         datas,
        //         tdata[a].apikey,
        //         tdata[a].secretkey,
        //         tdata[a].passphrase
        //       );
        //       if (future_data.code === "0") {
        //         if (futurepair[0]) {
        //           if (req.orderType === "market") {
        //             const value = (req.lever / 100) * req.sz;
        //             let data = JSON.stringify({
        //               instId: req.instId,
        //               tdMode: req.tdMode,
        //               ccy: req.ccy,
        //               tag: req.tag,
        //               side: req.side,
        //               ordType: req.orderType,
        //               posSide: "short",
        //               sz: req.sz,
        //               px: req.px,
        //             });

        //             var domain = "https://www.okx.com";
        //             var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
        //             var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
        //             var passphrase = "Pass@123";
        //             var iosTime = new Date().toISOString();
        //             var method = "POST";
        //             var textToSign = "";
        //             textToSign += iosTime;
        //             textToSign += method;
        //             textToSign += `/api/v5/trade/order${data}`;

        //             var sign = CryptoJS.enc.Base64.stringify(
        //               CryptoJS.HmacSHA256(
        //                 iosTime + "POST" + `/api/v5/trade/order${data}`,
        //                 tdata[a].secretkey
        //               )
        //             );

        //             let config = {
        //               method: "post",
        //               maxBodyLength: Infinity,
        //               url: `https://www.okx.com/api/v5/trade/order`,
        //               headers: {
        //                 "Content-Type": "application/json",
        //                 "OK-ACCESS-KEY": tdata[a].apikey,
        //                 "OK-ACCESS-SIGN": sign,
        //                 "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
        //                 "OK-ACCESS-TIMESTAMP": iosTime,
        //                 "TEXT-TO-SIGN": textToSign,
        //                 "x-simulated-trading":0,
        //                 Cookie: "locale=en-US",
        //               },
        //               data: data,
        //             };
        //             await axios
        //               .request(config)
        //               .then(async (ress) => {
        //                 if (ress.data.code === "0") {
        //                   // const data = {
        //                   //   user_id: user._id,
        //                   //   loan_user_id: user._id,
        //                   //   trade_pair_id: futurepair[0].data._id,
        //                   //   asset_id: futurepair[0].data._id,
        //                   //   trade_type: req.side,
        //                   //   ouid: "ouid",
        //                   //   symbol: req.instId.split("-")[0],
        //                   //   order_id: ress.data.data[0].ordId,
        //                   //   pair: req.instId,
        //                   //   order_type: req.orderType,
        //                   //   volume: Number(req.sz),
        //                   //   leverage: req.lever,
        //                   //   trade_at: "future",
        //                   //   trade_in: "okx"
        //                   // };
        //                   // copTrade(user, req, data)
        //                   // const tdata = await trade
        //                   //   .create(data)


        //                   const cpytrdData = new copytradehistory({
        //                     user_id: user._id,
        //                     loan_user_id: user._id,
        //                     trade_pair_id: futurepair[0].data._id,
        //                     asset_id: futurepair[0].data._id,
        //                     trade_type: req.side,
        //                     ouid: "ouid",
        //                     symbol: req.instId.split("-")[0],
        //                     order_id: ress.data.data[0].ordId,
        //                     pair: req.instId,
        //                     order_type: req.orderType,
        //                     volume: Number(req.sz),
        //                     leverage: req.lever,
        //                     trade_at: "future",
        //                     trade_in: "okx"
        //                   })
        //                   cpytrdData.save((err) => {
        //                     if (err) {
        //                       buildErrObject(200, err.message)
        //                     }
        //                     console.log('TRADE DATAS SAVED SUCCESSFULLY ');
        //                   }) 

        //                     .then((response) =>
        //                       res.status(200).json({
        //                         success: true,
        //                         result: "",
        //                         message: "Trade Created Successfully",
        //                       })
        //                     )
        //                     .catch((error) =>
        //                       res.status(400).json({
        //                         success: false,
        //                         result: "",
        //                         message: "Trade Not Created ",
        //                       })
        //                     );
        //                 } else {
        //                   res.status(400).json({
        //                     success: false,
        //                     result: "",
        //                     message: ress.data.data[0].sMsg,
        //                   });
        //                 }
        //               })
        //               .catch((err) => console.log(err));
        //           } else {
        //             let data = JSON.stringify({
        //               instId: req.instId,
        //               tdMode: req.tdMode,
        //               ccy: req.ccy,
        //               tag: req.tag,
        //               side: req.side,
        //               posSide: "short",
        //               ordType: req.orderType,
        //               sz: req.sz,
        //               px: req.px,
        //             });

        //             var domain = "https://www.okx.com";
        //             var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
        //             var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
        //             var passphrase = "Pass@123";
        //             var iosTime = new Date().toISOString();
        //             var method = "POST";
        //             var textToSign = "";
        //             textToSign += iosTime;
        //             textToSign += method;
        //             textToSign += `/api/v5/trade/order${data}`;

        //             var sign = CryptoJS.enc.Base64.stringify(
        //               CryptoJS.HmacSHA256(
        //                 iosTime + "POST" + `/api/v5/trade/order${data}`,
        //                 tdata[a].secretkey
        //               )
        //             );

        //             let config = {
        //               method: "post",
        //               maxBodyLength: Infinity,
        //               url: `https://www.okx.com/api/v5/trade/order`,
        //               headers: {
        //                 "Content-Type": "application/json",
        //                 "OK-ACCESS-KEY": tdata[a].apikey,
        //                 "OK-ACCESS-SIGN": sign,
        //                 "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
        //                 "OK-ACCESS-TIMESTAMP": iosTime,
        //                 "TEXT-TO-SIGN": textToSign,
        //                 "x-simulated-trading":0,
        //                 Cookie: "locale=en-US",
        //               },
        //               data: data,
        //             };

        //             await axios
        //               .request(config)
        //               .then(async (ress) => {
        //                 if (ress.data.code === "0") {
        //                   // const data = {
        //                   //   user_id: user._id,
        //                   //   loan_user_id: user._id,
        //                   //   trade_pair_id: futurepair[0].data._id,
        //                   //   asset_id: futurepair[0].data._id,
        //                   //   trade_type: req.side,
        //                   //   ouid: "ouid",
        //                   //   symbol: req.instId.split("-")[0],
        //                   //   order_id: ress.data.data[0].ordId,
        //                   //   pair: req.instId,
        //                   //   order_type: req.orderType,
        //                   //   price: Number(req.px),
        //                   //   leverage: req.lever,
        //                   //   volume: Number(req.sz),
        //                   //   trade_at: "future",
        //                   //   trade_in: "okx"
        //                   // };
        //                   // copTrade(user, req, data);
        //                   // const tdata = await trade
        //                   //   .create(data)


        //                   const cpytrdData = new copytradehistory({
        //                     user_id: user._id,
        //                       loan_user_id: user._id,
        //                       trade_pair_id: futurepair[0].data._id,
        //                       asset_id: futurepair[0].data._id,
        //                       trade_type: req.side,
        //                       ouid: "ouid",
        //                       symbol: req.instId.split("-")[0],
        //                       order_id: ress.data.data[0].ordId,
        //                       pair: req.instId,
        //                       order_type: req.orderType,
        //                       price: Number(req.px),
        //                       leverage: req.lever,
        //                       volume: Number(req.sz),
        //                       trade_at: "future",
        //                       trade_in: "okx"
        //                   })
        //                   cpytrdData.save((err) => {
        //                     if (err) {
        //                       buildErrObject(200, err.message)
        //                     }
        //                     console.log('TRADE DATAS SAVED SUCCESSFULLY ');
        //                   })                           

        //                     .then((response) =>
        //                       res.status(200).json({
        //                         success: true,
        //                         result: "",
        //                         message: "Trade Created Successfully",
        //                       })
        //                     )
        //                     .catch((error) =>
        //                       res.status(400).json({
        //                         success: false,
        //                         result: "",
        //                         message: "Trade Not Created ",
        //                       })
        //                     );
        //                 } else {
        //                   res.status(400).json({
        //                     success: false,
        //                     result: "",
        //                     message: ress.data.data[0].sMsg,
        //                   });
        //                 }
        //               })
        //               .catch((err) => console.log(err));
        //           }
        //         } else {
        //           res.status(400).json({
        //             success: false,
        //             result: "",
        //             message: "Invalid trade pairs",
        //           });
        //         }
        //       }
        //     } else {
        //       // let datas = JSON.stringify({ "instId": req.instId, "lever": req.lever, "mgnMode": req.tdMode, "posSide": "short" })
        //       // const future_data = await imperialApiAxios('post', `https://www.okx.com/api/v5/account/set-leverage`, `/api/v5/account/set-leverage${datas}`, datas, '93975967-ed47-4070-a436-329e22e14a1b', 'CBB7D9C9B6426A6562D2741A1E8AC9A6')
        //       // if (future_data.code === '0') {
        //       if (futurepair[0]) {
        //         if (req.orderType === "market") {
        //           let data = JSON.stringify({
        //             instId: req.instId,
        //             tdMode: req.tdMode,
        //             ccy: req.ccy,
        //             tag: req.tag,
        //             side: req.side,
        //             ordType: req.orderType,
        //             posSide: "short",
        //             sz: req.lever,
        //           });

        //           var domain = "https://www.okx.com";
        //           var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
        //           var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
        //           var passphrase = tdata[a].passphrase;
        //           var iosTime = new Date().toISOString();
        //           var method = "POST";
        //           var textToSign = "";
        //           textToSign += iosTime;
        //           textToSign += method;
        //           textToSign += `/api/v5/trade/order${data}`;

        //           var sign = CryptoJS.enc.Base64.stringify(
        //             CryptoJS.HmacSHA256(
        //               iosTime + "POST" + `/api/v5/trade/order${data}`,
        //               tdata[a].secretkey
        //             )
        //           );

        //           let config = {
        //             method: "post",
        //             maxBodyLength: Infinity,
        //             url: `https://www.okx.com/api/v5/trade/order`,
        //             headers: {
        //               "Content-Type": "application/json",
        //               "OK-ACCESS-KEY": tdata[a].apikey,
        //               "OK-ACCESS-SIGN": sign,
        //               "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
        //               "OK-ACCESS-TIMESTAMP": iosTime,
        //               "TEXT-TO-SIGN": textToSign,
        //               "x-simulated-trading":0,
        //               Cookie: "locale=en-US",
        //             },
        //             data: data,
        //           };
        //           await axios
        //             .request(config)
        //             .then(async (ress) => {
        //               if (ress.data.code === "0") {
        //                 const data = {
        //                   user_id: user._id,
        //                   loan_user_id: user._id,
        //                   trade_pair_id: futurepair[0]._id,
        //                   asset_id: futurepair[0]._id,
        //                   trade_type: req.side,
        //                   ouid: "ouid",
        //                   symbol: req.instId.split("-")[0],
        //                   order_id: ress.data.data[0].ordId,
        //                   pair: req.instId,
        //                   order_type: req.orderType,
        //                   volume: Number(req.sz),
        //                   leverage: req.lever,
        //                   trade_at: "future",
        //                   trade_in: "okx"
        //                 };
        //                 // copTrade(user, req, data);
        //                 const tdata = await trade
        //                   .create(data)
        //                   .then((response) =>
        //                     res.status(200).json({
        //                       success: true,
        //                       result: "",
        //                       message: "Trade Created Successfully",
        //                     })
        //                   )
        //                   .catch((error) =>
        //                     res.status(400).json({
        //                       success: false,
        //                       result: "",
        //                       message: "Trade Not Created ",
        //                     })
        //                   );
        //               } else {
        //                 res.status(400).json({
        //                   success: false,
        //                   result: "",
        //                   message: ress.data.data[0].sMsg,
        //                 });
        //               }
        //             })
        //             .catch((err) => console.log(err));
        //         } else {
        //           let data = JSON.stringify({
        //             instId: req.instId,
        //             tdMode: req.tdMode,
        //             ccy: req.ccy,
        //             tag: req.tag,
        //             side: req.side,
        //             ordType: req.orderType,
        //             posSide: "short",
        //             sz: req.lever,
        //             px: req.px,
        //           });

        //           var domain = "https://www.okx.com";
        //           var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
        //           var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
        //           var passphrase = "Pass@123";
        //           var iosTime = new Date().toISOString();
        //           var method = "POST";
        //           var textToSign = "";
        //           textToSign += iosTime;
        //           textToSign += method;
        //           textToSign += `/api/v5/trade/order${data}`;

        //           var sign = CryptoJS.enc.Base64.stringify(
        //             CryptoJS.HmacSHA256(
        //               iosTime + "POST" + `/api/v5/trade/order${data}`,
        //               tdata[a].secretkey
        //             )
        //           );

        //           let config = {
        //             method: "post",
        //             maxBodyLength: Infinity,
        //             url: `https://www.okx.com/api/v5/trade/order`,
        //             headers: {
        //               "Content-Type": "application/json",
        //               "OK-ACCESS-KEY": tdata[a].apikey,
        //               "OK-ACCESS-SIGN": sign,
        //               "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
        //               "OK-ACCESS-TIMESTAMP": iosTime,
        //               "TEXT-TO-SIGN": textToSign,
        //               "x-simulated-trading":0,
        //               Cookie: "locale=en-US",
        //             },
        //             data: data,
        //           };

        //           await axios
        //             .request(config)
        //             .then(async (ress) => {
        //               if (ress.data.code === "0") {
        //                 const data = {
        //                   user_id: user._id,
        //                   loan_user_id: user._id,
        //                   trade_pair_id: futurepair[0]._id,
        //                   asset_id: futurepair[0]._id,
        //                   trade_type: req.side,
        //                   ouid: "ouid",
        //                   symbol: req.instId.split("-")[0],
        //                   order_id: ress.data.data[0].ordId,
        //                   pair: req.instId,
        //                   order_type: req.orderType,
        //                   price: Number(req.px),
        //                   leverage: req.lever,
        //                   volume: Number(req.sz),
        //                   trade_at: "future",
        //                 };
        //                 // copTrade(user, req, data);
        //                 const tdata = await trade
        //                   .create(data)
        //                   .then((response) =>
        //                     res.status(200).json({
        //                       success: true,
        //                       result: "",
        //                       message: "Trade Created Successfully",
        //                     })
        //                   )
        //                   .catch((error) =>
        //                     res.status(400).json({
        //                       success: false,
        //                       result: "",
        //                       message: "Trade Not Created ",
        //                     })
        //                   );
        //               } else {
        //                 res.status(400).json({
        //                   success: false,
        //                   result: "",
        //                   message: ress.data.data[0].sMsg,
        //                 });
        //               }
        //             })
        //             .catch((err) => console.log(err));
        //         }
        //       } else {
        //         res.status(400).json({
        //           success: false,
        //           result: "",
        //           message: "Invalid trade pairs",
        //         });
        //       }
        //     }
        //     // }
        //     // var iosTime = new Date() / 1000;
        //     // var sign = CryptoJS.enc.Base64.stringify(
        //     //   CryptoJS.HmacSHA256(
        //     //     iosTime + "GET" + `/users/self/verify`,
        //     //     "CBB7D9C9B6426A6562D2741A1E8AC9A6"
        //     //   )
        //     // );
        //     // console.log(sign, "sign")
        //     // console.log(iosTime, "time")
        //   // }
        // } 
        else if (tdata[a].exchange == "binance") {
          if (tdata[a].trade_base?.spot && tdata[a].trade_base?.spot) {
            if (data.orderType === "market") {
              let cdata = {
                instId: data.instId,
                tdMode: data.tdMode,
                ccy: data.ccy,
                tag: data.tag,
                side: data.side,
                ordType: data.orderType,
                sz: data.sz,
              };

              const path = `/api/v5/trade/order${JSON.stringify(cdata)}`;

              const uid = tdata[a].user_id;
              const da = await imperialApiAxios(
                "post",
                "https://www.okx.com/api/v5/trade/order",
                path,
                cdata,
                tdata[a].apikey,
                tdata[a].secretkey,
                tdata[a].passphrase
              );
              if (da.code === "0") {
                // let data = {
                //   user_id: uid,
                //   loan_user_id: uid,
                //   exchange: tdata[a].exchange,
                //   trade_pair_id: cthdata.trade_pair_id,
                //   asset_id: cthdata.asset_id,
                //   trade_type: cthdata.trade_type,
                //   ouid: "ouid",
                //   symbol: cthdata.symbol,
                //   order_id: da.data[0].ordId,
                //   pair: cthdata.pair,
                //   order_type: cthdata.order_type,
                //   volume: cthdata.volume,
                //   leverage: "0",
                //   trade_at: cthdata.trade_at,
                //   entry_price: data.orderType == "market" ? data.market : cthdata.px,
                //   entry_price: data.orderType == "market" ? data.market : cthdata.px,
                //   trade_in: "binance"
                // };
                // const tdatas = await copytradehistory.create(data);

                const cpytrdData = new copytradehistory({
                  user_id: uid,
                  loan_user_id: uid,
                  exchange: tdata[a].exchange,
                  trade_pair_id: cthdata.trade_pair_id,
                  asset_id: cthdata.asset_id,
                  trade_type: cthdata.trade_type,
                  ouid: "ouid",
                  symbol: cthdata.symbol,
                  order_id: da.data[0].ordId,
                  pair: cthdata.pair,
                  order_type: cthdata.order_type,
                  volume: cthdata.volume,
                  leverage: "0",
                  trade_at: cthdata.trade_at,
                  entry_price: data.orderType == "market" ? data.market : cthdata.px,
                  entry_price: data.orderType == "market" ? data.market : cthdata.px,
                  trade_in: "binance"
                 })
                 cpytrdData.save((err) => {
                   if (err) {
                     buildErrObject(200, err.message)
                   } else{
                     console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                   }
                 })

              }
            } else if (data.orderType === "limit") {
              let cdata = {
                instId: data.instId,
                tdMode: data.tdMode,
                ccy: data.ccy,
                tag: data.tag,
                side: data.side,
                ordType: data.orderType,
                sz: data.sz,
                px: data.px,
              };
              const path = `/api/v5/trade/order${JSON.stringify(cdata)}`;

              const uid = tdata[a].user_id;
              const da = await imperialApiAxios(
                "post",
                "https://www.okx.com/api/v5/trade/order",
                path,
                cdata,
                tdata[a].apikey,
                tdata[a].secretkey,
                tdata[a].passphrase
              );
              if (da.code === "0") {
                // const data = {
                //   user_id: uid,
                //   loan_user_id: uid,
                //   exchange: tdata[a].exchange,
                //   trade_pair_id: cthdata.trade_pair_id,
                //   asset_id: cthdata.asset_id,
                //   trade_type: cthdata.trade_type,
                //   ouid: "ouid",
                //   symbol: cthdata.symbol,
                //   order_id: da.data[0].ordId,
                //   pair: cthdata.pair,
                //   order_type: cthdata.order_type,
                //   volume: cthdata.volume,
                //   price: cthdata.price,
                //   leverage: "0",
                //   trade_at: cthdata.trade_at,
                //   entry_price: data.orderType == "market" ? data.market : cthdata.px,
                //   entry_price: data.orderType == "market" ? data.market : cthdata.px,
                //   trade_in: "binance"
                // };
                // const tdatas = await copytradehistory.create(data);

                const cpytrdData = new copytradehistory({
                  user_id: uid,
                  loan_user_id: uid,
                  exchange: tdata[a].exchange,
                  trade_pair_id: cthdata.trade_pair_id,
                  asset_id: cthdata.asset_id,
                  trade_type: cthdata.trade_type,
                  ouid: "ouid",
                  symbol: cthdata.symbol,
                  order_id: da.data[0].ordId,
                  pair: cthdata.pair,
                  order_type: cthdata.order_type,
                  volume: cthdata.volume,
                  price: cthdata.price,
                  leverage: "0",
                  trade_at: cthdata.trade_at,
                  entry_price: data.orderType == "market" ? data.market : cthdata.px,
                  entry_price: data.orderType == "market" ? data.market : cthdata.px,
                  trade_in: "binance"
                 })
                 cpytrdData.save((err) => {
                   if (err) {
                     buildErrObject(200, err.message)
                   } else{
                     console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                   }
                 })

              }
            }
          } else if (data.trade_at === "Margin" && data.tdMode === "isolated" && tdata[a].trade_base?.margin) {
            if (data.orderType === "limit") {
              let cdata = {
                instId: data.instId,
                tdMode: data.tdMode,
                ccy: data.ccy,
                tag: data.tag,
                side: data.side,
                ordType: data.orderType,
                sz: data.sz,
                px: data.px,
              };
              const path = `/api/v5/trade/order${JSON.stringify(cdata)}`;

              const uid = tdata[a].user_id;
              let levdata = JSON.stringify({
                instId: cthdata.pair,
                lever: cthdata.leverage,
                mgnMode: data.tdMode,
              });
              const data1 = await imperialApiAxios(
                "post",
                `https://www.okx.com/api/v5/account/set-leverage`,
                `/api/v5/account/set-leverage${levdata}`,
                levdata,
                tdata[a].apikey,
                tdata[a].secretkey
              );
              if (data1.code === "0") {
                const da1 = await imperialApiAxios(
                  "post",
                  "https://www.okx.com/api/v5/trade/order",
                  path,
                  cdata,
                  tdata[a].apikey,
                  tdata[a].secretkey,
                  tdata[a].passphrase
                );
                if (da1.code === "0") {
                  // const copycre = {
                  //   user_id: uid,
                  //   loan_user_id: uid,
                  //   exchange: tdata[a].exchange,
                  //   trade_pair_id: cthdata.trade_pair_id,
                  //   asset_id: cthdata.asset_id,
                  //   trade_type: cthdata.trade_type,
                  //   ouid: "ouid",
                  //   symbol: cthdata.symbol,
                  //   order_id: da1.data[0].ordId,
                  //   pair: cthdata.pair,
                  //   order_type: cthdata.order_type,
                  //   volume: cthdata.volume,
                  //   leverage: cthdata.leverage,
                  //   price: cthdata.price,
                  //   trade_at: cthdata.trade_at,
                  //   trade_in: "binance"
                  // };
                  // const tdatas = await copytradehistory.create(copycre);

                  const cpytrdData = new copytradehistory({
                    user_id: uid,
                    loan_user_id: uid,
                    exchange: tdata[a].exchange,
                    trade_pair_id: cthdata.trade_pair_id,
                    asset_id: cthdata.asset_id,
                    trade_type: cthdata.trade_type,
                    ouid: "ouid",
                    symbol: cthdata.symbol,
                    order_id: da1.data[0].ordId,
                    pair: cthdata.pair,
                    order_type: cthdata.order_type,
                    volume: cthdata.volume,
                    leverage: cthdata.leverage,
                    price: cthdata.price,
                    trade_at: cthdata.trade_at,
                    trade_in: "binance"
                   })
                   cpytrdData.save((err) => {
                     if (err) {
                       buildErrObject(200, err.message)
                     } else{
                       console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                     }
                   })

                }
              }
            } else if (data.orderType === "market") {
              let cdata = {
                instId: data.instId,
                tdMode: data.tdMode,
                ccy: data.ccy,
                tag: data.tag,
                side: data.side,
                ordType: data.orderType,
                sz: data.sz,
              };
              const path = `/api/v5/trade/order${JSON.stringify(cdata)}`;

              const uid = tdata[a].user_id;
              let levdata = JSON.stringify({
                instId: cthdata.pair,
                lever: cthdata.leverage,
                mgnMode: data.tdMode,
              });
              const data1 = await imperialApiAxios(
                "post",
                `https://www.okx.com/api/v5/account/set-leverage`,
                `/api/v5/account/set-leverage${levdata}`,
                levdata,
                tdata[a].apikey,
                tdata[a].secretkey
              );
              if (data1.code === "0") {
                const da1 = await imperialApiAxios(
                  "post",
                  "https://www.okx.com/api/v5/trade/order",
                  path,
                  cdata,
                  tdata[a].apikey,
                  tdata[a].secretkey,
                  tdata[a].passphrase
                );

                if (da1.code === "0") {
                  // const copycre = {
                  //   user_id: uid,
                  //   loan_user_id: uid,
                  //   exchange: tdata[a].exchange,
                  //   trade_pair_id: cthdata.trade_pair_id,
                  //   asset_id: cthdata.asset_id,
                  //   trade_type: cthdata.trade_type,
                  //   ouid: "ouid",
                  //   symbol: cthdata.symbol,
                  //   order_id: da1.data[0].ordId,
                  //   pair: cthdata.pair,
                  //   order_type: cthdata.order_type,
                  //   volume: cthdata.volume,
                  //   leverage: cthdata.leverage,
                  //   price: "0",
                  //   trade_at: cthdata.trade_at,
                  //   trade_in: "binance"
                  // };
                  // const tdatas = await copytradehistory.create(copycre);

                  const cpytrdData = new copytradehistory({
                    user_id: uid,
                    loan_user_id: uid,
                    exchange: tdata[a].exchange,
                    trade_pair_id: cthdata.trade_pair_id,
                    asset_id: cthdata.asset_id,
                    trade_type: cthdata.trade_type,
                    ouid: "ouid",
                    symbol: cthdata.symbol,
                    order_id: da1.data[0].ordId,
                    pair: cthdata.pair,
                    order_type: cthdata.order_type,
                    volume: cthdata.volume,
                    leverage: cthdata.leverage,
                    price: "0",
                    trade_at: cthdata.trade_at,
                    trade_in: "binance"
                   })
                   cpytrdData.save((err) => {
                     if (err) {
                       buildErrObject(200, err.message)
                     } else{
                       console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                     }
                   })

                }
              }
            }
          } else if (data.trade_at === "Margin" && data.tdMode === "cross" && tdata[a].trade_base?.margin) {
            if (data.orderType === "limit") {
              let cdata = {
                instId: data.instId,
                tdMode: data.tdMode,
                ccy: data.ccy,
                tag: data.tag,
                side: data.side,
                ordType: data.orderType,
                sz: data.sz,
                px: data.px,
              };
              const path = `/api/v5/trade/order${JSON.stringify(cdata)}`;

              const uid = tdata[a].user_id;
              let levdata = JSON.stringify({
                instId: cthdata.pair,
                lever: cthdata.leverage,
                mgnMode: data.tdMode,
              });
              const data1 = await imperialApiAxios(
                "post",
                `https://www.okx.com/api/v5/account/set-leverage`,
                `/api/v5/account/set-leverage${levdata}`,
                levdata,
                tdata[a].apikey,
                tdata[a].secretkey
              );
              if (data1.code === "0") {
                const da1 = await imperialApiAxios(
                  "post",
                  "https://www.okx.com/api/v5/trade/order",
                  path,
                  cdata,
                  tdata[a].apikey,
                  tdata[a].secretkey,
                  tdata[a].passphrase
                );
                if (da1.code === "0") {
                  // const copycre = {
                  //   user_id: uid,
                  //   loan_user_id: uid,
                  //   exchange: tdata[a].exchange,
                  //   trade_pair_id: cthdata.trade_pair_id,
                  //   asset_id: cthdata.asset_id,
                  //   trade_type: cthdata.trade_type,
                  //   ouid: "ouid",
                  //   symbol: cthdata.symbol,
                  //   order_id: da1.data[0].ordId,
                  //   pair: cthdata.pair,
                  //   order_type: cthdata.order_type,
                  //   volume: cthdata.volume,
                  //   leverage: cthdata.leverage,
                  //   price: cthdata.price,
                  //   trade_at: cthdata.trade_at,
                  //   trade_in: "binance"
                  // };
                  // const tdatas = await copytradehistory.create(copycre);

                  const cpytrdData = new copytradehistory({
                    user_id: uid,
                    loan_user_id: uid,
                    exchange: tdata[a].exchange,
                    trade_pair_id: cthdata.trade_pair_id,
                    asset_id: cthdata.asset_id,
                    trade_type: cthdata.trade_type,
                    ouid: "ouid",
                    symbol: cthdata.symbol,
                    order_id: da1.data[0].ordId,
                    pair: cthdata.pair,
                    order_type: cthdata.order_type,
                    volume: cthdata.volume,
                    leverage: cthdata.leverage,
                    price: cthdata.price,
                    trade_at: cthdata.trade_at,
                    trade_in: "binance"
                   })
                   cpytrdData.save((err) => {
                     if (err) {
                       buildErrObject(200, err.message)
                     } else{
                       console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                     }
                   })

                }
              }
            } else if (data.orderType === "market") {
              let cdata = {
                instId: data.instId,
                tdMode: data.tdMode,
                ccy: data.ccy,
                tag: data.tag,
                side: data.side,
                ordType: data.orderType,
                sz: data.sz,
              };
              const path = `/api/v5/trade/order${JSON.stringify(cdata)}`;

              const uid = tdata[a].user_id;
              let levdata = JSON.stringify({
                instId: cthdata.pair,
                lever: cthdata.leverage,
                mgnMode: data.tdMode,
              });
              const data1 = await imperialApiAxios(
                "post",
                `https://www.okx.com/api/v5/account/set-leverage`,
                `/api/v5/account/set-leverage${levdata}`,
                levdata,
                tdata[a].apikey,
                tdata[a].secretkey
              );
              if (data1.code === "0") {
                const da1 = await imperialApiAxios(
                  "post",
                  "https://www.okx.com/api/v5/trade/order",
                  path,
                  cdata,
                  tdata[a].apikey,
                  tdata[a].secretkey,
                  tdata[a].passphrase
                );
                if (da1.code === "0") {
                  // const copycre = {
                  //   user_id: uid,
                  //   loan_user_id: uid,
                  //   exchange: tdata[a].exchange,
                  //   trade_pair_id: cthdata.trade_pair_id,
                  //   asset_id: cthdata.asset_id,
                  //   trade_type: cthdata.trade_type,
                  //   ouid: "ouid",
                  //   symbol: cthdata.symbol,
                  //   order_id: da1.data[0].ordId,
                  //   pair: cthdata.pair,
                  //   order_type: cthdata.order_type,
                  //   volume: cthdata.volume,
                  //   leverage: cthdata.leverage,
                  //   price: "0",
                  //   trade_at: cthdata.trade_at,
                  //   trade_in: "binance"
                  // };
                  // const tdatas = await copytradehistory.create(copycre);

                  const cpytrdData = new copytradehistory({
                    user_id: uid,
                    loan_user_id: uid,
                    exchange: tdata[a].exchange,
                    trade_pair_id: cthdata.trade_pair_id,
                    asset_id: cthdata.asset_id,
                    trade_type: cthdata.trade_type,
                    ouid: "ouid",
                    symbol: cthdata.symbol,
                    order_id: da1.data[0].ordId,
                    pair: cthdata.pair,
                    order_type: cthdata.order_type,
                    volume: cthdata.volume,
                    leverage: cthdata.leverage,
                    price: cthdata.price,
                    trade_at: cthdata.trade_at,
                    trade_in: "binance"
                   })
                   cpytrdData.save((err) => {
                     if (err) {
                       buildErrObject(200, err.message)
                     } else{
                       console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                     }
                   })

                }
              }
            }
          } else if (
            (req.trade_at === "future-open-long" ||
              req.trade_at === "future-close-long") && tdata[a].trade_base?.future
          ) {
            const split = req.trade_at.split("-");
            if (split[1] === "open") {
              let datas = JSON.stringify({
                instId: req.instId,
                lever: req.lever,
                mgnMode: req.tdMode,
                posSide: "long",
              });
              const future_data = await imperialApiAxios(
                "post",
                `https://www.okx.com/api/v5/account/set-leverage`,
                `/api/v5/account/set-leverage${datas}`,
                datas,
                tdata[a].apikey,
                tdata[a].secretkey,
                tdata[a].passphrase
              );
              if (future_data.code === "0") {
                if (futurepair[0]) {
                  if (req.orderType === "market") {
                    let data = JSON.stringify({
                      instId: req.instId,
                      tdMode: req.tdMode,
                      ccy: req.ccy,
                      tag: req.tag,
                      side: req.side,
                      ordType: req.orderType,
                      posSide: "long",
                      sz: req.sz,
                      px: req.px,
                    });

                    var domain = "https://www.okx.com";
                    var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
                    var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
                    var passphrase = "Pass@123";
                    var iosTime = new Date().toISOString();
                    var method = "POST";
                    var textToSign = "";
                    textToSign += iosTime;
                    textToSign += method;
                    textToSign += `/api/v5/trade/order${data}`;

                    var sign = CryptoJS.enc.Base64.stringify(
                      CryptoJS.HmacSHA256(
                        iosTime + "POST" + `/api/v5/trade/order${data}`,
                        tdata[a].secretkey
                      )
                    );

                    let config = {
                      method: "post",
                      maxBodyLength: Infinity,
                      url: `https://www.okx.com/api/v5/trade/order`,
                      headers: {
                        "Content-Type": "application/json",
                        "OK-ACCESS-KEY": tdata[a].apikey,
                        "OK-ACCESS-SIGN": sign,
                        "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
                        "OK-ACCESS-TIMESTAMP": iosTime,
                        "TEXT-TO-SIGN": textToSign,
                        "x-simulated-trading":0,
                        Cookie: "locale=en-US",
                      },
                      data: data,
                    };
                    await axios
                      .request(config)
                      .then(async (ress) => {
                        if (ress.data.code === "0") {
                          // const data = {
                          //   user_id: user._id,
                          //   loan_user_id: user._id,
                          //   trade_pair_id: futurepair[0].data._id,
                          //   asset_id: futurepair[0].data._id,
                          //   trade_type: req.side,
                          //   ouid: "ouid",
                          //   symbol: req.instId.split("-")[0],
                          //   order_id: ress.data.data[0].ordId,
                          //   pair: req.instId,
                          //   order_type: req.orderType,
                          //   volume: Number(req.sz),
                          //   leverage: req.lever,
                          //   trade_at: "future",
                          //   trade_in: "binance"
                          // };
                          // copTrade(user, req, data)
                          // const tdata = await trade
                          //   .create(data)

                          const cpytrdData = new copytradehistory({
                            user_id: user._id,
                            loan_user_id: user._id,
                            trade_pair_id: futurepair[0].data._id,
                            asset_id: futurepair[0].data._id,
                            trade_type: req.side,
                            ouid: "ouid",
                            symbol: req.instId.split("-")[0],
                            order_id: ress.data.data[0].ordId,
                            pair: req.instId,
                            order_type: req.orderType,
                            volume: Number(req.sz),
                            leverage: req.lever,
                            trade_at: "future",
                            trade_in: "binance"
                           })
                           cpytrdData.save((err) => {
                             if (err) {
                               buildErrObject(200, err.message)
                             } else{
                               console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                             }
                           })

                            .then((response) =>
                              res.status(200).json({
                                success: true,
                                result: "",
                                message: "Trade Created Successfully",
                              })
                            )
                            .catch((error) =>
                              res.status(400).json({
                                success: false,
                                result: "",
                                message: "Trade Not Created ",
                              })
                            );
                        } else {
                          res.status(400).json({
                            success: false,
                            result: "",
                            message: ress.data.data[0].sMsg,
                          });
                        }
                      })
                      .catch((err) => console.log(err));
                  } else {
                    let data = JSON.stringify({
                      instId: req.instId,
                      tdMode: req.tdMode,
                      ccy: req.ccy,
                      tag: req.tag,
                      side: req.side,
                      posSide: "long",
                      ordType: req.orderType,
                      sz: req.sz,
                      px: req.px,
                    });

                    var domain = "https://www.okx.com";
                    var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
                    var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
                    var passphrase = "Pass@123";
                    var iosTime = new Date().toISOString();
                    var method = "POST";
                    var textToSign = "";
                    textToSign += iosTime;
                    textToSign += method;
                    textToSign += `/api/v5/trade/order${data}`;

                    var sign = CryptoJS.enc.Base64.stringify(
                      CryptoJS.HmacSHA256(
                        iosTime + "POST" + `/api/v5/trade/order${data}`,
                        tdata[a].secretkey
                      )
                    );

                    let config = {
                      method: "post",
                      maxBodyLength: Infinity,
                      url: `https://www.okx.com/api/v5/trade/order`,
                      headers: {
                        "Content-Type": "application/json",
                        "OK-ACCESS-KEY": "93975967-ed47-4070-a436-329e22e14a1b",
                        "OK-ACCESS-SIGN": sign,
                        "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
                        "OK-ACCESS-TIMESTAMP": iosTime,
                        "TEXT-TO-SIGN": textToSign,
                        "x-simulated-trading":0,
                        Cookie: "locale=en-US",
                      },
                      data: data,
                    };

                    await axios
                      .request(config)
                      .then(async (ress) => {
                        if (ress.data.code === "0") {
                          // const data = {
                          //   user_id: user._id,
                          //   loan_user_id: user._id,
                          //   trade_pair_id: futurepair[0].data._id,
                          //   asset_id: futurepair[0].data._id,
                          //   trade_type: req.side,
                          //   ouid: "ouid",
                          //   symbol: req.instId.split("-")[0],
                          //   order_id: ress.data.data[0].ordId,
                          //   pair: req.instId,
                          //   order_type: req.orderType,
                          //   price: Number(req.px),
                          //   leverage: req.lever,
                          //   volume: Number(req.sz),
                          //   trade_at: "future",
                          // };
                          // copTrade(user, req, data);
                          // const tdata = await trade
                          //   .create(data)

                          const cpytrdData = new copytradehistory({
                            user_id: user._id,
                            loan_user_id: user._id,
                            trade_pair_id: futurepair[0].data._id,
                            asset_id: futurepair[0].data._id,
                            trade_type: req.side,
                            ouid: "ouid",
                            symbol: req.instId.split("-")[0],
                            order_id: ress.data.data[0].ordId,
                            pair: req.instId,
                            order_type: req.orderType,
                            price: Number(req.px),
                            leverage: req.lever,
                            volume: Number(req.sz),
                            trade_at: "future",
                           })
                           cpytrdData.save((err) => {
                             if (err) {
                               buildErrObject(200, err.message)
                             } else{
                               console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                             }
                           })

                            .then((response) =>
                              res.status(200).json({
                                success: true,
                                result: "",
                                message: "Trade Created Successfully",
                              })
                            )
                            .catch((error) =>
                              res.status(400).json({
                                success: false,
                                result: "",
                                message: "Trade Not Created ",
                              })
                            );
                        } else {
                          res.status(400).json({
                            success: false,
                            result: "",
                            message: ress.data.data[0].sMsg,
                          });
                        }
                      })
                      .catch((err) => console.log(err));
                  }
                } else {
                  res.status(400).json({
                    success: false,
                    result: "",
                    message: "Invalid trade pairs",
                  });
                }
              }
            } else {
              // let datas = JSON.stringify({ "instId": req.instId, "lever": req.lever, "mgnMode": req.tdMode, "posSide": "long" })
              // const future_data = await imperialApiAxios('post', `https://www.okx.com/api/v5/account/set-leverage`, `/api/v5/account/set-leverage${datas}`, datas, '93975967-ed47-4070-a436-329e22e14a1b', 'CBB7D9C9B6426A6562D2741A1E8AC9A6')

              if (futurepair[0]) {
                if (req.orderType === "market") {
                  const value = (req.lever / 100) * req.sz;
                  console.log(value, "val");
                  let data = JSON.stringify({
                    instId: req.instId,
                    tdMode: req.tdMode,
                    ccy: req.ccy,
                    tag: req.tag,
                    side: req.side,
                    ordType: req.orderType,
                    posSide: "long",
                    sz: req.lever,
                  });

                  var domain = "https://www.okx.com";
                  var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
                  var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
                  var passphrase = "Pass@123";
                  var iosTime = new Date().toISOString();
                  var method = "POST";
                  var textToSign = "";
                  textToSign += iosTime;
                  textToSign += method;
                  textToSign += `/api/v5/trade/order${data}`;

                  var sign = CryptoJS.enc.Base64.stringify(
                    CryptoJS.HmacSHA256(
                      iosTime + "POST" + `/api/v5/trade/order${data}`,
                      tdata[a].secretkey
                    )
                  );

                  let config = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: `https://www.okx.com/api/v5/trade/order`,
                    headers: {
                      "Content-Type": "application/json",
                      "OK-ACCESS-KEY": tdata[a].apikey,
                      "OK-ACCESS-SIGN": sign,
                      "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
                      "OK-ACCESS-TIMESTAMP": iosTime,
                      "TEXT-TO-SIGN": textToSign,
                      "x-simulated-trading":0,
                      Cookie: "locale=en-US",
                    },
                    data: data,
                  };
                  await axios
                    .request(config)
                    .then(async (ress) => {
                      if (ress.data.code === "0") {
                        // const data = {
                        //   user_id: user._id,
                        //   loan_user_id: user._id,
                        //   trade_pair_id: futurepair[0]._id,
                        //   asset_id: futurepair[0]._id,
                        //   trade_type: req.side,
                        //   ouid: "ouid",
                        //   symbol: req.instId.split("-")[0],
                        //   order_id: ress.data.data[0].ordId,
                        //   pair: req.instId,
                        //   order_type: req.orderType,
                        //   volume: Number(req.sz),
                        //   leverage: req.lever,
                        //   trade_at: "future",
                        //   trade_in: "binance"
                        // };
                        // copTrade(user, req, data);
                        // const tdata = await trade
                        //   .create(data)

                        const cpytrdData = new copytradehistory({
                          user_id: user._id,
                          loan_user_id: user._id,
                          trade_pair_id: futurepair[0]._id,
                          asset_id: futurepair[0]._id,
                          trade_type: req.side,
                          ouid: "ouid",
                          symbol: req.instId.split("-")[0],
                          order_id: ress.data.data[0].ordId,
                          pair: req.instId,
                          order_type: req.orderType,
                          volume: Number(req.sz),
                          leverage: req.lever,
                          trade_at: "future",
                          trade_in: "binance"
                         })
                         cpytrdData.save((err) => {
                           if (err) {
                             buildErrObject(200, err.message)
                           } else{
                             console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                           }
                         })

                          .then((response) =>
                            res.status(200).json({
                              success: true,
                              result: "",
                              message: "Trade Created Successfully",
                            })
                          )
                          .catch((error) =>
                            res.status(400).json({
                              success: false,
                              result: "",
                              message: "Trade Not Created ",
                            })
                          );
                      } else {
                        res.status(400).json({
                          success: false,
                          result: "",
                          message: ress.data.data[0].sMsg,
                        });
                      }
                    })
                    .catch((err) => console.log(err));
                } else {
                  const value = (req.lever / 100) * req.sz;
                  console.log(value, "val");
                  let data = JSON.stringify({
                    instId: req.instId,
                    tdMode: req.tdMode,
                    ccy: req.ccy,
                    tag: req.tag,
                    side: req.side,
                    ordType: req.orderType,
                    posSide: "long",
                    sz: req.lever,
                    px: req.px,
                  });

                  var domain = "https://www.okx.com";
                  var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
                  var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
                  var passphrase = "Pass@123";
                  var iosTime = new Date().toISOString();
                  var method = "POST";
                  var textToSign = "";
                  textToSign += iosTime;
                  textToSign += method;
                  textToSign += `/api/v5/trade/order${data}`;

                  var sign = CryptoJS.enc.Base64.stringify(
                    CryptoJS.HmacSHA256(
                      iosTime + "POST" + `/api/v5/trade/order${data}`,
                      tdata[a].secretkey
                    )
                  );

                  let config = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: `https://www.okx.com/api/v5/trade/order`,
                    headers: {
                      "Content-Type": "application/json",
                      "OK-ACCESS-KEY": tdata[a].apikey,
                      "OK-ACCESS-SIGN": sign,
                      "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
                      "OK-ACCESS-TIMESTAMP": iosTime,
                      "TEXT-TO-SIGN": textToSign,
                      "x-simulated-trading":0,
                      Cookie: "locale=en-US",
                    },
                    data: data,
                  };

                  await axios
                    .request(config)
                    .then(async (ress) => {
                      if (ress.data.code === "0") {
                        // const data = {
                        //   user_id: user._id,
                        //   loan_user_id: user._id,
                        //   trade_pair_id: futurepair[0]._id,
                        //   asset_id: futurepair[0]._id,
                        //   trade_type: req.side,
                        //   ouid: "ouid",
                        //   symbol: req.instId.split("-")[0],
                        //   order_id: ress.data.data[0].ordId,
                        //   pair: req.instId,
                        //   order_type: req.orderType,
                        //   price: Number(req.px),
                        //   leverage: req.lever,
                        //   volume: Number(req.sz),
                        //   trade_at: "future",
                        //   trade_in: "binance"
                        // };
                        // copTrade(user, req, data);
                        // const tdata = await trade
                        //   .create(data)

                        const cpytrdData = new copytradehistory({
                          user_id: user._id,
                          loan_user_id: user._id,
                          trade_pair_id: futurepair[0]._id,
                          asset_id: futurepair[0]._id,
                          trade_type: req.side,
                          ouid: "ouid",
                          symbol: req.instId.split("-")[0],
                          order_id: ress.data.data[0].ordId,
                          pair: req.instId,
                          order_type: req.orderType,
                          price: Number(req.px),
                          leverage: req.lever,
                          volume: Number(req.sz),
                          trade_at: "future",
                          trade_in: "binance"
                         })
                         cpytrdData.save((err) => {
                           if (err) {
                             buildErrObject(200, err.message)
                           } else{
                             console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                           }
                         })

                          .then((response) =>
                            res.status(200).json({
                              success: true,
                              result: "",
                              message: "Trade Created Successfully",
                            })
                          )
                          .catch((error) =>
                            res.status(400).json({
                              success: false,
                              result: "",
                              message: "Trade Not Created ",
                            })
                          );
                      } else {
                        res.status(400).json({
                          success: false,
                          result: "",
                          message: ress.data.data[0].sMsg,
                        });
                      }
                    })
                    .catch((err) => console.log(err));
                }
              } else {
                res.status(400).json({
                  success: false,
                  result: "",
                  message: "Invalid trade pairs",
                });
              }
            }
            // var iosTime = new Date() / 1000;
            // var sign = CryptoJS.enc.Base64.stringify(
            //   CryptoJS.HmacSHA256(
            //     iosTime + "GET" + `/users/self/verify`,
            //     "CBB7D9C9B6426A6562D2741A1E8AC9A6"
            //   )
            // );
            // console.log(sign, "sign")
            // console.log(iosTime, "time")
          } else if (
            (req.trade_at === "future-open-short" ||
              req.trade_at === "future-close-short") && tdata[a].trade_base?.future
          ) {
            const split = req.trade_at.split("-");
            if (split[1] === "open") {
              let datas = JSON.stringify({
                instId: req.instId,
                lever: req.lever,
                mgnMode: req.tdMode,
                posSide: "short",
              });
              const future_data = await imperialApiAxios(
                "post",
                `https://www.okx.com/api/v5/account/set-leverage`,
                `/api/v5/account/set-leverage${datas}`,
                datas,
                tdata[a].apikey,
                tdata[a].secretkey,
                tdata[a].passphrase
              );
              if (future_data.code === "0") {
                if (futurepair[0]) {
                  if (req.orderType === "market") {
                    const value = (req.lever / 100) * req.sz;
                    let data = JSON.stringify({
                      instId: req.instId,
                      tdMode: req.tdMode,
                      ccy: req.ccy,
                      tag: req.tag,
                      side: req.side,
                      ordType: req.orderType,
                      posSide: "short",
                      sz: req.sz,
                      px: req.px,
                    });

                    var domain = "https://www.okx.com";
                    var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
                    var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
                    var passphrase = "Pass@123";
                    var iosTime = new Date().toISOString();
                    var method = "POST";
                    var textToSign = "";
                    textToSign += iosTime;
                    textToSign += method;
                    textToSign += `/api/v5/trade/order${data}`;

                    var sign = CryptoJS.enc.Base64.stringify(
                      CryptoJS.HmacSHA256(
                        iosTime + "POST" + `/api/v5/trade/order${data}`,
                        tdata[a].secretkey
                      )
                    );

                    let config = {
                      method: "post",
                      maxBodyLength: Infinity,
                      url: `https://www.okx.com/api/v5/trade/order`,
                      headers: {
                        "Content-Type": "application/json",
                        "OK-ACCESS-KEY": tdata[a].apikey,
                        "OK-ACCESS-SIGN": sign,
                        "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
                        "OK-ACCESS-TIMESTAMP": iosTime,
                        "TEXT-TO-SIGN": textToSign,
                        "x-simulated-trading":0,
                        Cookie: "locale=en-US",
                      },
                      data: data,
                    };
                    await axios
                      .request(config)
                      .then(async (ress) => {
                        if (ress.data.code === "0") {
                          // const data = {
                          //   user_id: user._id,
                          //   loan_user_id: user._id,
                          //   trade_pair_id: futurepair[0].data._id,
                          //   asset_id: futurepair[0].data._id,
                          //   trade_type: req.side,
                          //   ouid: "ouid",
                          //   symbol: req.instId.split("-")[0],
                          //   order_id: ress.data.data[0].ordId,
                          //   pair: req.instId,
                          //   order_type: req.orderType,
                          //   volume: Number(req.sz),
                          //   leverage: req.lever,
                          //   trade_at: "future",
                          //   trade_in: "binance"
                          // };
                          // copTrade(user, req, data)
                          // const tdata = await trade
                          //   .create(data)

                          const cpytrdData = new copytradehistory({
                            user_id: user._id,
                            loan_user_id: user._id,
                            trade_pair_id: futurepair[0].data._id,
                            asset_id: futurepair[0].data._id,
                            trade_type: req.side,
                            ouid: "ouid",
                            symbol: req.instId.split("-")[0],
                            order_id: ress.data.data[0].ordId,
                            pair: req.instId,
                            order_type: req.orderType,
                            volume: Number(req.sz),
                            leverage: req.lever,
                            trade_at: "future",
                            trade_in: "binance"
                           })
                           cpytrdData.save((err) => {
                             if (err) {
                               buildErrObject(200, err.message)
                             } else{
                               console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                             }
                           })

                            .then((response) =>
                              res.status(200).json({
                                success: true,
                                result: "",
                                message: "Trade Created Successfully",
                              })
                            )
                            .catch((error) =>
                              res.status(400).json({
                                success: false,
                                result: "",
                                message: "Trade Not Created ",
                              })
                            );
                        } else {
                          res.status(400).json({
                            success: false,
                            result: "",
                            message: ress.data.data[0].sMsg,
                          });
                        }
                      })
                      .catch((err) => console.log(err));
                  } else {
                    let data = JSON.stringify({
                      instId: req.instId,
                      tdMode: req.tdMode,
                      ccy: req.ccy,
                      tag: req.tag,
                      side: req.side,
                      posSide: "short",
                      ordType: req.orderType,
                      sz: req.sz,
                      px: req.px,
                    });

                    var domain = "https://www.okx.com";
                    var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
                    var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
                    var passphrase = "Pass@123";
                    var iosTime = new Date().toISOString();
                    var method = "POST";
                    var textToSign = "";
                    textToSign += iosTime;
                    textToSign += method;
                    textToSign += `/api/v5/trade/order${data}`;

                    var sign = CryptoJS.enc.Base64.stringify(
                      CryptoJS.HmacSHA256(
                        iosTime + "POST" + `/api/v5/trade/order${data}`,
                        tdata[a].secretkey
                      )
                    );

                    let config = {
                      method: "post",
                      maxBodyLength: Infinity,
                      url: `https://www.okx.com/api/v5/trade/order`,
                      headers: {
                        "Content-Type": "application/json",
                        "OK-ACCESS-KEY": tdata[a].apikey,
                        "OK-ACCESS-SIGN": sign,
                        "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
                        "OK-ACCESS-TIMESTAMP": iosTime,
                        "TEXT-TO-SIGN": textToSign,
                        "x-simulated-trading":0,
                        Cookie: "locale=en-US",
                      },
                      data: data,
                    };

                    await axios
                      .request(config)
                      .then(async (ress) => {
                        if (ress.data.code === "0") {
                          // const data = {
                          //   user_id: user._id,
                          //   loan_user_id: user._id,
                          //   trade_pair_id: futurepair[0].data._id,
                          //   asset_id: futurepair[0].data._id,
                          //   trade_type: req.side,
                          //   ouid: "ouid",
                          //   symbol: req.instId.split("-")[0],
                          //   order_id: ress.data.data[0].ordId,
                          //   pair: req.instId,
                          //   order_type: req.orderType,
                          //   price: Number(req.px),
                          //   leverage: req.lever,
                          //   volume: Number(req.sz),
                          //   trade_at: "future",
                          //   trade_in: "binance"
                          // };
                          // copTrade(user, req, data);
                          // const tdata = await trade
                          //   .create(data)

                          const cpytrdData = new copytradehistory({
                            user_id: user._id,
                            loan_user_id: user._id,
                            trade_pair_id: futurepair[0].data._id,
                            asset_id: futurepair[0].data._id,
                            trade_type: req.side,
                            ouid: "ouid",
                            symbol: req.instId.split("-")[0],
                            order_id: ress.data.data[0].ordId,
                            pair: req.instId,
                            order_type: req.orderType,
                            price: Number(req.px),
                            leverage: req.lever,
                            volume: Number(req.sz),
                            trade_at: "future",
                            trade_in: "binance"
                           })
                           cpytrdData.save((err) => {
                             if (err) {
                               buildErrObject(200, err.message)
                             } else{
                               console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                             }
                           })

                            .then((response) =>
                              res.status(200).json({
                                success: true,
                                result: "",
                                message: "Trade Created Successfully",
                              })
                            )
                            .catch((error) =>
                              res.status(400).json({
                                success: false,
                                result: "",
                                message: "Trade Not Created ",
                              })
                            );
                        } else {
                          res.status(400).json({
                            success: false,
                            result: "",
                            message: ress.data.data[0].sMsg,
                          });
                        }
                      })
                      .catch((err) => console.log(err));
                  }
                } else {
                  res.status(400).json({
                    success: false,
                    result: "",
                    message: "Invalid trade pairs",
                  });
                }
              }
            } else {
              // let datas = JSON.stringify({ "instId": req.instId, "lever": req.lever, "mgnMode": req.tdMode, "posSide": "short" })
              // const future_data = await imperialApiAxios('post', `https://www.okx.com/api/v5/account/set-leverage`, `/api/v5/account/set-leverage${datas}`, datas, '93975967-ed47-4070-a436-329e22e14a1b', 'CBB7D9C9B6426A6562D2741A1E8AC9A6')
              // if (future_data.code === '0') {
              if (futurepair[0]) {
                if (req.orderType === "market") {
                  let data = JSON.stringify({
                    instId: req.instId,
                    tdMode: req.tdMode,
                    ccy: req.ccy,
                    tag: req.tag,
                    side: req.side,
                    ordType: req.orderType,
                    posSide: "short",
                    sz: req.lever,
                  });

                  var domain = "https://www.okx.com";
                  var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
                  var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
                  var passphrase = tdata[a].passphrase;
                  var iosTime = new Date().toISOString();
                  var method = "POST";
                  var textToSign = "";
                  textToSign += iosTime;
                  textToSign += method;
                  textToSign += `/api/v5/trade/order${data}`;

                  var sign = CryptoJS.enc.Base64.stringify(
                    CryptoJS.HmacSHA256(
                      iosTime + "POST" + `/api/v5/trade/order${data}`,
                      tdata[a].secretkey
                    )
                  );

                  let config = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: `https://www.okx.com/api/v5/trade/order`,
                    headers: {
                      "Content-Type": "application/json",
                      "OK-ACCESS-KEY": tdata[a].apikey,
                      "OK-ACCESS-SIGN": sign,
                      "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
                      "OK-ACCESS-TIMESTAMP": iosTime,
                      "TEXT-TO-SIGN": textToSign,
                      "x-simulated-trading":0,
                      Cookie: "locale=en-US",
                    },
                    data: data,
                  };
                  await axios
                    .request(config)
                    .then(async (ress) => {
                      if (ress.data.code === "0") {
                        // const data = {
                        //   user_id: user._id,
                        //   loan_user_id: user._id,
                        //   trade_pair_id: futurepair[0]._id,
                        //   asset_id: futurepair[0]._id,
                        //   trade_type: req.side,
                        //   ouid: "ouid",
                        //   symbol: req.instId.split("-")[0],
                        //   order_id: ress.data.data[0].ordId,
                        //   pair: req.instId,
                        //   order_type: req.orderType,
                        //   volume: Number(req.sz),
                        //   leverage: req.lever,
                        //   trade_at: "future",
                        //   trade_in: "binance"
                        // };
                        // copTrade(user, req, data);
                        // const tdata = await trade
                        //   .create(data)

                        const cpytrdData = new copytradehistory({
                          user_id: user._id,
                          loan_user_id: user._id,
                          trade_pair_id: futurepair[0]._id,
                          asset_id: futurepair[0]._id,
                          trade_type: req.side,
                          ouid: "ouid",
                          symbol: req.instId.split("-")[0],
                          order_id: ress.data.data[0].ordId,
                          pair: req.instId,
                          order_type: req.orderType,
                          volume: Number(req.sz),
                          leverage: req.lever,
                          trade_at: "future",
                          trade_in: "binance"
                         })
                         cpytrdData.save((err) => {
                           if (err) {
                             buildErrObject(200, err.message)
                           } else{
                             console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                           }
                         })

                          .then((response) =>
                            res.status(200).json({
                              success: true,
                              result: "",
                              message: "Trade Created Successfully",
                            })
                          )
                          .catch((error) =>
                            res.status(400).json({
                              success: false,
                              result: "",
                              message: "Trade Not Created ",
                            })
                          );
                      } else {
                        res.status(400).json({
                          success: false,
                          result: "",
                          message: ress.data.data[0].sMsg,
                        });
                      }
                    })
                    .catch((err) => console.log(err));
                } else {
                  let data = JSON.stringify({
                    instId: req.instId,
                    tdMode: req.tdMode,
                    ccy: req.ccy,
                    tag: req.tag,
                    side: req.side,
                    ordType: req.orderType,
                    posSide: "short",
                    sz: req.lever,
                    px: req.px,
                  });

                  var domain = "https://www.okx.com";
                  var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
                  var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
                  var passphrase = "Pass@123";
                  var iosTime = new Date().toISOString();
                  var method = "POST";
                  var textToSign = "";
                  textToSign += iosTime;
                  textToSign += method;
                  textToSign += `/api/v5/trade/order${data}`;

                  var sign = CryptoJS.enc.Base64.stringify(
                    CryptoJS.HmacSHA256(
                      iosTime + "POST" + `/api/v5/trade/order${data}`,
                      tdata[a].secretkey
                    )
                  );

                  let config = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: `https://www.okx.com/api/v5/trade/order`,
                    headers: {
                      "Content-Type": "application/json",
                      "OK-ACCESS-KEY": tdata[a].apikey,
                      "OK-ACCESS-SIGN": sign,
                      "OK-ACCESS-PASSPHRASE": tdata[a].passphrase,
                      "OK-ACCESS-TIMESTAMP": iosTime,
                      "TEXT-TO-SIGN": textToSign,
                      "x-simulated-trading":0,
                      Cookie: "locale=en-US",
                    },
                    data: data,
                  };

                  await axios
                    .request(config)
                    .then(async (ress) => {
                      if (ress.data.code === "0") {
                        // const data = {
                        //   user_id: user._id,
                        //   loan_user_id: user._id,
                        //   trade_pair_id: futurepair[0]._id,
                        //   asset_id: futurepair[0]._id,
                        //   trade_type: req.side,
                        //   ouid: "ouid",
                        //   symbol: req.instId.split("-")[0],
                        //   order_id: ress.data.data[0].ordId,
                        //   pair: req.instId,
                        //   order_type: req.orderType,
                        //   price: Number(req.px),
                        //   leverage: req.lever,
                        //   volume: Number(req.sz),
                        //   trade_at: "future",
                        //   trade_in: "binance"
                        // };
                        // copTrade(user, req, data);
                        // const tdata = await trade
                        //   .create(data)

                        const cpytrdData = new copytradehistory({
                          user_id: user._id,
                          loan_user_id: user._id,
                          trade_pair_id: futurepair[0]._id,
                          asset_id: futurepair[0]._id,
                          trade_type: req.side,
                          ouid: "ouid",
                          symbol: req.instId.split("-")[0],
                          order_id: ress.data.data[0].ordId,
                          pair: req.instId,
                          order_type: req.orderType,
                          price: Number(req.px),
                          leverage: req.lever,
                          volume: Number(req.sz),
                          trade_at: "future",
                          trade_in: "binance"
                         })
                         cpytrdData.save((err) => {
                           if (err) {
                             buildErrObject(200, err.message)
                           } else{
                             console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                           }
                         })

                          .then((response) =>
                            res.status(200).json({
                              success: true,
                              result: "",
                              message: "Trade Created Successfully",
                            })
                          )
                          .catch((error) =>
                            res.status(400).json({
                              success: false,
                              result: "",
                              message: "Trade Not Created ",
                            })
                          );
                      } else {
                        res.status(400).json({
                          success: false,
                          result: "",
                          message: ress.data.data[0].sMsg,
                        });
                      }
                    })
                    .catch((err) => console.log(err));
                }
              } else {
                res.status(400).json({
                  success: false,
                  result: "",
                  message: "Invalid trade pairs",
                });
              }
            }
            // }
            // var iosTime = new Date() / 1000;
            // var sign = CryptoJS.enc.Base64.stringify(
            //   CryptoJS.HmacSHA256(
            //     iosTime + "GET" + `/users/self/verify`,
            //     "CBB7D9C9B6426A6562D2741A1E8AC9A6"
            //   )
            // );
            // console.log(sign, "sign")
            // console.log(iosTime, "time")
          }
        } else if (tdata[a].exchange == "bybit"){
          console.log('BYbit starttttt');
                const client = new RestClientV5({
                    key: tdata[a].apikey,
                    secret: tdata[a].secretkey,
                    testnet: false,
                },);
       
      //   const client = new RestClientV5({
      //     key: 'AZIEKWTVtGs92FG9a5',
      //     secret: 'KTYja4QaeU85Q58iz01arRZl7b6vv0ufND7W',
      //     demoTrading: true
      // },);
if (req.trade_at == "spot") {
  if (req.orderType == "market") {
      console.log(req,'market');
    await client.submitOrder({
                  category: req.trade_at,
                  symbol: req.instId,
                  side: req.side,
                  orderType: req.orderType,
                  qty: `${req.sz}`,
                  price: req.px,
                  isLeverage: 0
              })
              .then( async(result) => {
                  console.log(result,'DEMO');
                  if(result.retCode == 0){
                      
                      const tradeData = {
                          user_id: tdata[a]?.user_id,
                          loan_user_id: tdata[a]?.user_id,
                          // trade_pair_id: assertpair._id,
                          // asset_id: ASSETS?._id ? ASSETS?._id : assertpair._id,
                          trade_type: req.side,
                          ouid: "ouid",
                          // symbol: req.instId.split("-")[0],
                          symbol: req.instId.slice(0,-4),
                          order_id: result.result.orderId,
                          pair: req.instId,
                          order_type: req.orderType,
                          volume: Number(req.sz),
                          leverage: req.lever || 0,
                          trade_at: req.trade_at,
                          entry_price: req.market ? req.market : req.px,
                          trade_in: "bybit",
                          tpPrice: req.tpPrice ? req.tpPrice : '--',
                          slPrice: req.slPrice ? req.slPrice : '--'
                      }

                       await copytradehistory.create(tradeData)

                      // res.status(200).json({
                      //     success: true,
                      //     result: [],
                      //     message: "Trade Placed SuccessFully",
                      // });
                      console.log('COPY TRADE PLACED');
                  } else if(result.retMsg == "ab not enough for new order"){
                      // res.status(200).json({
                      //     success: false,
                      //     result: [],
                      //     message: "Insufficient Balance",
                      // });
                      console.log('INSUFFICIENT BALANCE');
                  } else {
                      // res.status(200).json({
                      //     success: false,
                      //     result: result.retCode,
                      //     message: result.retMsg,
                      // });
                      console.log(result.retMsg,'*******************');
                  }
              })
              .catch(err => {
                  console.error("Trade error: ", err);
                  handleError(res, err);
              });
    
  } else {
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
  } else {
        params = {
          category: req.trade_at,
          symbol: req.instId,
          side: req.side,
          orderType: req.orderType,   
          qty: Number(req.sz) > 0 ? `${Number(req.sz)}` : '1',
          price: `${req.px}`
          }
  }

    await client.submitOrder(params)
      .then(async (result) => {
          if(result.retCode == 0){
              const tradeData = {
                  user_id: tdata[a]?.user_id,
                  loan_user_id: tdata[a]?.user_id,
                  trade_type: req.side,
                  ouid: "ouid",
                  symbol: req.instId.slice(0,-4),
                  order_id: result.result.orderId,
                  pair: req.instId,
                  order_type: req.orderType,
                  volume: Number(req.sz),
                  leverage: req.lever || 0,
                  trade_at: req.trade_at,
                  entry_price: req.orderType == "market" ? req.market : req.px,
                  trade_in: "bybit",
                  tpPrice: req.tpPrice ? `${req.tpPrice}` : '--',
                  slPrice: req.slPrice ? `${req.slPrice}` : '--'
              }
  
              await copytradehistory.create(tradeData)
               
              // res.status(200).json({
              //     success: true,
              //     result: [],
              //     message: "Trade Placed SuccessFully",
              // });
              console.log('COPY TRADE PLACED SUCCESSFULLY');
          } else if(result.retMsg == "ab not enough for new order"){
              // res.status(200).json({
              //     success: false,
              //     result: [],
              //     message: "Insufficient Balance",
              // });
              console.log('Insufficient Balance FOR COPY TRADE');
          } else {
              // res.status(200).json({
              //     success: false,
              //     result: [],
              //     message: result.retMsg,
              // });
              console.log(result.retMsg);
          }
      })
      .catch(err => {
          console.error("Trade error: ", err);
          handleError(res, err);
      });
      
  }

} else if (req.trade_at == "Margin") {
  // console.log(req.side,'WHICH SIDE');
  if(req.side == "Buy" || req.side == "buy"){

    const leverageData = await client.setSpotMarginLeverage(`${req.lever}`)

    if(leverageData.retCode == 0 || leverageData.retMsg == "leverage not modified"){
      console.log(leverageData.retMsg);
    } else {
      console.log(leverageData.retMsg);
    }

      const mode = req.tdMode == "isolated" ? 'ISOLATED_MARGIN' : 'REGULAR_MARGIN'
      console.log(mode,'MODE MARGIN');
       const data = await client.setMarginMode(mode)
  if(data.retCode == 0){
     
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
  } else {
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
      console.log(tradeData,'tradeData COPY TRADE');
      if(tradeData.retCode == 0){

          const cpytrdData = new copytradehistory({
            user_id: tdata[a].user_id,
            loan_user_id: tdata[a].user_id,
            trade_type: req.side.toLowerCase(),
            ouid: "ouid",
            symbol: req.instId.slice(0,-4),
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
           })
           cpytrdData.save((err) => {
             if (err) {
              console.log(err,'ERROR SAVING TRADE DATA');
            } else{
               console.log('COPYTRADE DATAS SAVED SUCCESSFULLY ')
             }
           })
          console.log('COPY TRADE PLACED SUCCESSFULLY');
      } else if (tradeData.retMsg == "ab not enough for new order"){
          // res.status(200).json({
          //     success: false,
          //     result: [],
          //     message: "Insufficient Balance",
          // });
          console.log('Insufficient Balance');
      } else {
          console.log(tradeData.retMsg);
          // res.status(200).json({
          //     success: false,
          //     result: [],
          //     message: tradeData.retMsg,
          // });
      }
  
    
   
  } else {
      console.log(data.retMsg);
  }
  } else if(req.side == "Sell" ||req.side == "sell") {

    const leverageData = await client.setSpotMarginLeverage(`${req.lever}`)

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
      console.log(mode,'MODE MARGIN');
       const data = await client.setMarginMode(mode)
  if(data.retCode == 0){
      console.log('SETTING COLLATREAL COIN1');
      const keydata = {
        apikey: tdata[a].apikey,
        secretkey: tdata[a].secretkey
      }
      console.log(keydata,'keydata');
      const collatreldata = await setCollatralCoin(req,res,keydata)
      console.log(collatreldata,'*******************');

      if(collatreldata.success == true){
  
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
        } else {
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
       
          if(tradeData.retCode == 0){
              const tradee = {
                  user_id: user._id,
                  loan_user_id: user._id,
                  trade_type: req.side.toLowerCase(),
                  ouid: "ouid",
                  symbol: req.instId.slice(0,-4),
                  order_id: tradeData.result.orderId,
                  pair: req.instId,
                  order_type: req.orderType,
                  volume: Number(req.sz),
                  leverage: req.lever || 0,
                  trade_at: req.trade_at,
                  entry_price: req.orderType == "market" ? req.market : req.px,
                  trade_in: req.trade_in,
                  tpPrice: req.tpPrice ? req.tpPrice : '--',
                  slPrice: req.slPrice ? req.slPrice : '--'
              }

               await copytradehistory.create(tradee)

              // res.status(200).json({
              //     success: true,
              //     result: [],
              //     message: "Trade Placed SuccessFully",
              // });
              console.log('COPY TRADE PLACED');
          } else if (tradeData.retMsg == "ab not enough for new order"){
              // res.status(200).json({
              //     success: false,
              //     result: [],
              //     message: "Insufficient Balance",
              // });
              console.log('BALANCE NOT ENOUGH');
          } else {
              // console.log(tradeData);
              // res.status(200).json({
              //     success: false,
              //     result: [],
              //     message: tradeData.retMsg,
              // });
              console.log(tradeData.retMsg,'*******************');
          }
          
         
      } else {
          // res.status(200).json({
          //     success: false,
          //     result: [],
          //     message: collatreldata.message,
          // });
          console.log(collatreldata.message,'*******************');
      }

  } else {
      // res.status(200).json({
      //     success: true,
      //     result: [],
      //     message: data.retMsg,
      // });
      console.log(data.retMsg,'*******************')
  }
  }


} 
// else if (req.trade_at == "Margin" && req.tdMode == "isolated") {
//     const data = await client.toggleSpotMarginTrade(1)
//    console.log(data,'*******************');
// if(data.retCode == 0){

//   const leverageData = await client.setLeverage({
//       category: 'linear',
//       symbol: req.instId,
//       buyLeverage: req.lever > 0 ? req.lever : '1',
//       sellLeverage: req.lever > 0 ? req.lever : '1',
//     })

//     if(leverageData.retCode == 0 || leverageData.retMsg == "leverage not modified"){
//       console.log('SWITCHED TO MARGIN',req.tdMode );
//       const tradeData = await client.submitOrder({
//           category: 'spot',
//           symbol: req.instId,
//           side: req.side,
//           orderType: req.orderType,
//           qty: req.sz,
//           price: req.px,
//           isLeverage: 1
//       })
   
//       if(tradeData.retCode == 0){
//         console.log(tradeData,'COPY TRADEeee');
  
//         const cpytrdData = new copytradehistory({
//                user_id: tdata[a].user_id,
//                loan_user_id: tdata[a].user_id,
//                trade_type: req.side.toLowerCase(),
//                ouid: "ouid",
//                symbol: req.instId.slice(0,-4),
//                order_id: tradeData.result.orderId,
//                pair: req.instId,
//                order_type: req.orderType,
//                volume: Number(req.sz),
//                leverage: req.lever || 0,
//                trade_at: req.trade_at,
//                entry_price: req.px,
//                trade_in: "bybit",
//        })
//        await cpytrdData.save((err) => {
//          if (err) {
//           console.log(err);
//         } else{
//            console.log('TRADE DATAS SAVED SUCCESSFULLY ')
//          }
//        })

//           // res.status(200).json({
//           //     success: true,
//           //     result: [],
//           //     message: "Trade Placed SuccessFully",
//           // });
//           console.log('COPY TRADE PLACED SUCCESS FULLY');
//       } else if (tradeData.retMsg == "ab not enough for new order"){
//           // res.status(200).json({
//           //     success: false,
//           //     result: [],
//           //     message: "Insufficient Balance",
//           // });
//           console.log('BALANCE NOT ENOUGH');
//       } else {
//           console.log(tradeData.retMsg);
//           // res.status(200).json({
//           //     success: false,
//           //     result: [],
//           //     message: tradeData.retMsg,
//           // });
//       }
//     } else {
//       // res.status(200).json({
//       //     success: false,
//       //     result: [],
//       //     message: leverageData.retMsg,
//       // });
//       console.log(leverageData.retMsg);
//     }

// } else {
//   //  res.status(200).json({
//   //      success: true,
//   //      result: [],
//   //      message: data.retMsg,
//   //  });
//    console.log(data.retMsg);
// }

// }
else if ( req.trade_at == "future-open-long" || req.trade_at == "future-close-long") {  
       const mode = req.tdMode == "isolated" ? 'ISOLATED_MARGIN' : 'REGULAR_MARGIN'
       console.log(mode,'MODE MARGIN');
        const data = await client.setMarginMode(mode)

                  console.log(data,'RESPONSE');
                  if(data.retCode == 0){
                      console.log(req.lever,'*******************');
                 const leverageData = await client.setLeverage({
                        category: 'linear',
                        symbol: req.instId,
                        buyLeverage: Number(req.lever) > 0 ? `${req.lever}` : '1',
                        sellLeverage: Number(req.lever) > 0 ? `${req.lever}` : '1',
                      })
                      console.log(leverageData,'LEVER');
                      if(leverageData.retCode == 0 || leverageData.retMsg == "leverage not modified"){
                        console.log(req.side,'SIDE');

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
                                qty: `${req.sz}`,
                                price: req.px,
                                }
                        }

                          const futureTrade = await client.submitOrder(params)
                          console.log(futureTrade,'FUTURE TRADE COPY');
                          if(futureTrade.retCode == 0){
                            console.log('Success copy trading');
                              // const futuretrade = {
                              //     user_id: user._id,
                              //     loan_user_id: user._id,
                              //     trade_type: req.side.toLowerCase(),
                              //     ouid: "ouid",
                              //     symbol: req.instId.slice(0,-4),
                              //     order_id: futureTrade.result.orderId,
                              //     pair: req.instId,
                              //     order_type: req.orderType,
                              //     volume: Number(req.sz),
                              //     leverage: req.lever || 0,
                              //     trade_at: 'future',
                              //     entry_price: req.orderType == "market" ? req.market : req.px,
                              //     trade_in: "bybit",
                              // }
              
                              //  await copytradehistory.create(futuretrade)
                               

                              const cpytrdData = new copytradehistory({
                                  user_id: tdata[a].user_id,
                                  loan_user_id: tdata[a].user_id,
                                  trade_type: req.side.toLowerCase(),
                                  ouid: "ouid",
                                  symbol: req.instId.slice(0,-4),
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
                               })
                               cpytrdData.save((err) => {
                                 if (err) {
                                  console.log(err);
                                } else{
                                   console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                                 }
                               })

                              // res.status(200).json({
                              //     success: true,
                              //     result: [],
                              //     message: "Trade Placed SuccessFully",
                              // });
                              console.log('COPY TRADE PLACED SUCCESSFULLY');
                          } else if(futureTrade.retMsg == "ab not enough for new order"){
                              // res.status(200).json({
                              //     success: false,
                              //     result: [],
                              //     message: "Available Balance not enough",
                              // });
                              console.log('BALANCE NOT ENOUGH');
                          } else {
                              // res.status(200).json({
                              //     success: false,
                              //     result: [],
                              //     message: futureTrade.retMsg,
                              // });
                              console.log(futureTrade.retMsg,'*******************');
                          }

                      } else {
                      //     res.status(200).json({
                      //     success: false,
                      //     result: [],
                      //     message: leverageData.retMsg,
                      // });
                      console.log(leverageData.retMsg,'*******************');
                      }
                      // res.status(200).json({
                      //     success: true,
                      //     result: [],
                      //     message: "TRADE",
                      // });
                  } else {
                      // res.status(200).json({
                      //     success: false,
                      //     result: [],
                      //     message: data.retMsg,
                      // });
                      console.log(data.retMsg,'*******************');
                  }
} else if(req.trade_at === "future-open-short" || req.trade_at === "future-close-short"){
const mode = req.tdMode == "isolated" ? 'ISOLATED_MARGIN' : 'REGULAR_MARGIN'
console.log(mode,'MODE MARGIN');
const data = await client.setMarginMode(mode)

         console.log(data,'RESPONSE');
         if(data.retCode == 0){
             console.log(req.lever,'*******************');
        const leverageData = await client.setLeverage({
               category: 'linear',
               symbol: req.instId,
               buyLeverage: Number(req.lever) > 0 ? `${req.lever}` : '1',
               sellLeverage: Number(req.lever) > 0 ? `${req.lever}` : '1',
             })
             console.log(leverageData,'LEVER');
             if(leverageData.retCode == 0 || leverageData.retMsg == "leverage not modified"){
               console.log(req.side,'SIDEeee');

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
                 console.log(futureTrade,'COPY FUTURE TRADE');
                 if(futureTrade.retCode == 0){
                  console.log('trade success');
                  const cpytrd = new copytradehistory({
                        user_id: tdata[a]?.user_id,
                        loan_user_id: tdata[a]?.user_id,
                        trade_type: req.side.toLowerCase(),
                        ouid: "ouid",
                        symbol: req.instId.slice(0,-4),
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
                   })
                  await cpytrd.save((err) => {
                     if (err) {
                      console.log(err);
                    } else{
                       console.log('TRADE DATAS SAVED SUCCESSFULLY ')
                     }
                   })

                    //  res.status(200).json({
                    //      success: true,
                    //      result: [],
                    //      message: "Trade Placed SuccessFully",
                    //  });
                    console.log('COPYyyy TRADE PLACED');
                 } else if(futureTrade.retMsg == "ab not enough for new order"){
                    //  res.status(200).json({
                    //      success: false,
                    //      result: [],
                    //      message: "Available Balance not enough",
                    //  });
                    console.log('BALANCE NOT ENOUGH');
                 } else {
                    //  res.status(200).json({
                    //      success: false,
                    //      result: [],
                    //      message: futureTrade.retMsg,
                    //  });
                    console.log(futureTrade.retMsg,'*******************');
                 }

             } else {
            //      res.status(200).json({
            //      success: false,
            //      result: [],
            //      message: leverageData.retMsg,
            //  });
            console.log(leverageData.retMsg,'*******************');
             }

         } else {
            //  res.status(200).json({
            //      success: false,
            //      result: [],
            //      message: data.retMsg,
            //  });
            console.log(data.retMsg,'*******************');
         }
} else {
res.status(200).json({
  success: false,
  result: [],
  message: "Something Went Wrong",
})
}
        }
      }
    } else {
      console.log("Data not fount");
    }

    const cdata = data;
  } catch (error) { }
};
module.exports = { copTrade };
