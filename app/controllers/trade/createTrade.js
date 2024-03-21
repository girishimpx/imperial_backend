const trade = require("../../models/trade");
const copytrade = require("../../models/copytrade");
const { createItem } = require("../../middleware/db");
const { handleError } = require("../../middleware/utils");
const { matchedData } = require("express-validator");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const tradePAirs = require("../../models/tradePairs");
const futurePairs = require("../../models/allTickers");
const ASSETS = require("../../models/assets");
const { copTrade } = require("./helpers/copytrade");
const { levrageSet } = require("../../middleware/ImperialApi/levrageSet");
const {
  imperialApiAxios,
} = require("../../middleware/ImperialApi/imperialApi");
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createTrade = async (req, res) => {
  try {
    const user = req.user;
    req = matchedData(req);
    if (user.trader_type == "master") {
      console.log('MASTER INSIDE');
      const copytradedetail = await copytrade.find({ user_id: user._id });

      if (copytradedetail.length > 0) {
        console.log('IF OF CREATE TRADE*******************************' );
        const assertpair = await tradePAirs.findOne({ tradepair: req.instId });
        const futurepair = await futurePairs.aggregate([
          {
            $unwind: "$data",
          },
          {
            $match: {
              "data.instId": req.instId,
            },
          },
        ]);
        const assetDetails = await ASSETS.findOne({
          tradepair: req.instId.split("-")[0],
        });
        if (req.trade_at === "spot") {
          console.log('MASTER SPOT');
          if (assertpair) {
            if (req.orderType === "market") {
              let data = JSON.stringify({
                instId: req.instId,
                tdMode: req.tdMode,
                ccy: req.ccy,
                tag: req.tag,
                side: req.side,
                ordType: req.orderType,
                sz: req.sz,
                price : req.market
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
                  iosTime + "POST" + `/api/v5/trade/order${data}`, copytradedetail[0].secretkey
                )
              );

              let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: `https://www.okx.com/api/v5/trade/order`,
                headers: {
                  "Content-Type": "application/json",
                  "OK-ACCESS-KEY": copytradedetail[0].apikey ? copytradedetail[0].apikey : "93975967-ed47-4070-a436-329e22e14a1b",
                  "OK-ACCESS-SIGN": sign,
                  "OK-ACCESS-PASSPHRASE": copytradedetail[0].passphrase ? copytradedetail[0].passphrase : "Pass@123",
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
                    const data = {
                      user_id: user._id,
                      loan_user_id: user._id,
                      trade_pair_id: assertpair._id,
                      asset_id: ASSETS?._id ? ASSETS?._id : assertpair._id,
                      trade_type: req.side,
                      ouid: "ouid",
                      symbol: req.instId.split("-")[0],
                      order_id: ress.data.data[0].ordId,
                      pair: req.instId,
                      order_type: req.orderType,
                      volume: Number(req.sz),
                      trade_at: req.trade_at,
                      entry_price: req.orderType == "market" ? req.market : req.px,
                      trade_in: "imperial",

                    };
                    copTrade(user, req, data);
                    const tdata = await trade
                      .create(data)
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
                .catch((err) => {
                  res.status(400).json({
                    success: false,
                    result: "",
                    message: err?.response?.data?.msg,
                  });
                });
            } else {
              console.log('MASTER ELSE LINE 146');
              let data = JSON.stringify({
                instId: req.instId,
                tdMode: req.tdMode,
                ccy: req.ccy,
                tag: req.tag,
                side: req.side,
                ordType: req.orderType,
                sz: Math.round(req.sz),
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
                  iosTime + "POST" + `/api/v5/trade/order${data}`, copytradedetail[0].secretkey
                )
              );

              let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: `https://www.okx.com/api/v5/trade/order`,
                headers: {
                  "Content-Type": "application/json",
                  "OK-ACCESS-KEY": copytradedetail[0].apikey ? copytradedetail[0].apikey : "93975967-ed47-4070-a436-329e22e14a1b",
                  "OK-ACCESS-SIGN": sign,
                  "OK-ACCESS-PASSPHRASE": copytradedetail[0].passphrase ? copytradedetail[0].passphrase : "Pass@123",
                  "OK-ACCESS-TIMESTAMP": iosTime,
                  "TEXT-TO-SIGN": textToSign,
                  "x-simulated-trading":0,
                  Cookie: "locale=en-US",
                },
                data: data,
              };
              console.log('MASTER',config,data,'***');
              await axios
                .request(config)
                .then(async (ress) => {
                  console.log('MASTER RESS ' ,ress);
                  if (ress.data.code === "0") {
                    const data = {
                      user_id: user._id,
                      loan_user_id: user._id,
                      trade_pair_id: assertpair._id,
                      asset_id: ASSETS?._id ? ASSETS?._id : assertpair._id,
                      trade_type: req.side,
                      ouid: "ouid",
                      symbol: req.instId.split("-")[0],
                      order_id: ress.data.data[0].ordId,
                      pair: req.instId,
                      order_type: req.orderType,
                      price: Number(req.px),
                      volume: Number(req.sz),
                      trade_at: req.trade_at,
                      entry_price: req.orderType == "market" ? req.market : req.px,
                      trade_in: "imperial"
                    };
                    console.log(data,'COPY TRADING DATA ****************************************************************');
                    await copTrade(user, req, data);
                    const tdata = await trade
                      .create(data)
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
                    console.log('END ELSE ERROR');
                    res.status(400).json({
                      success: false,
                      result: "",
                      message: ress.data.data[0].sMsg,
                    });
                  }
                })
                .catch((err) => {
                  res.status(400).json({
                    success: false,
                    result: "",
                    message: err?.response?.data?.msg,
                  });
                });
            }
          } else {
            res.status(400).json({
              success: false,
              result: "",
              message: "Invalid trade pairs",
            });
          }
        } else if (req.trade_at === "Margin" && req.tdMode === "isolated") {
          let datas = JSON.stringify({
            instId: req.instId,
            lever: req.lever,
            mgnMode: req.tdMode,
          });
          const data = await imperialApiAxios(
            "post",
            `https://www.okx.com/api/v5/account/set-leverage`,
            `/api/v5/account/set-leverage${datas}`,
            datas,
            copytradedetail[0].apikey,
            copytradedetail[0].secretkey,
            copytradedetail[0].passphrase,
          );
          if (data.code === "0") {
            if (assertpair) {
              if (req.orderType === "market") {
                let data = JSON.stringify({
                  instId: req.instId,
                  tdMode: req.tdMode,
                  ccy: req.ccy,
                  tag: req.tag,
                  side: req.side,
                  ordType: req.orderType,
                  sz: req.sz,
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
                    iosTime + "POST" + `/api/v5/trade/order${data}`, copytradedetail[0].secretkey
                  )
                );

                let config = {
                  method: "post",
                  maxBodyLength: Infinity,
                  url: `https://www.okx.com/api/v5/trade/order`,
                  headers: {
                    "Content-Type": "application/json",
                    "OK-ACCESS-KEY": copytradedetail[0].apikey ? copytradedetail[0].apikey : "93975967-ed47-4070-a436-329e22e14a1b",
                    "OK-ACCESS-SIGN": sign,
                    "OK-ACCESS-PASSPHRASE": copytradedetail[0].passphrase ? copytradedetail[0].passphrase : "Pass@123",
                    "OK-ACCESS-TIMESTAMP": iosTime,
                    "TEXT-TO-SIGN": textToSign,
                    Cookie: "locale=en-US",
                  },
                  data: data,
                };
                await axios
                  .request(config)
                  .then(async (ress) => {
                    if (ress.data.code === "0") {
                      const data = {
                        user_id: user._id,
                        loan_user_id: user._id,
                        trade_pair_id: assertpair._id,
                        asset_id: ASSETS?._id ? ASSETS?._id : assertpair._id,
                        trade_type: req.side,
                        ouid: "ouid",
                        symbol: req.instId.split("-")[0],
                        order_id: ress.data.data[0].ordId,
                        pair: req.instId,
                        order_type: req.orderType,
                        volume: Number(req.sz),
                        leverage: req.lever,
                        trade_at: req.trade_at,
                        entry_price: req.orderType == "market" ? req.market : req.px,
                        trade_in: "imperial"
                      };
                      copTrade(user, req, data);
                      const tdata = await trade
                        .create(data)
                        .then((ress) =>
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
                  .catch((err) => {
                    res.status(400).json({
                      success: false,
                      result: "",
                      message: err?.response?.data?.msg,
                    });
                  });
              } else {
                let data = JSON.stringify({
                  instId: req.instId,
                  tdMode: req.tdMode,
                  ccy: req.ccy,
                  tag: req.tag,
                  side: req.side,
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
                    iosTime + "POST" + `/api/v5/trade/order${data}`, copytradedetail[0].secretkey
                  )
                );

                let config = {
                  method: "post",
                  maxBodyLength: Infinity,
                  url: `https://www.okx.com/api/v5/trade/order`,
                  headers: {
                    "Content-Type": "application/json",
                    "OK-ACCESS-KEY": copytradedetail[0].apikey ? copytradedetail[0].apikey : "93975967-ed47-4070-a436-329e22e14a1b",
                    "OK-ACCESS-SIGN": sign,
                    "OK-ACCESS-PASSPHRASE": copytradedetail[0].passphrase ? copytradedetail[0].passphrase : "Pass@123",
                    "OK-ACCESS-TIMESTAMP": iosTime,
                    "TEXT-TO-SIGN": textToSign,
                    Cookie: "locale=en-US",
                  },
                  data: data,
                };

                await axios
                  .request(config)
                  .then(async (ress) => {
                    if (ress.data.code === "0") {
                      const data = {
                        user_id: user._id,
                        loan_user_id: user._id,
                        trade_pair_id: assertpair._id,
                        asset_id: ASSETS?._id ? ASSETS?._id : assertpair._id,
                        trade_type: req.side,
                        ouid: "ouid",
                        symbol: req.instId.split("-")[0],
                        order_id: ress.data.data[0].ordId,
                        pair: req.instId,
                        order_type: req.orderType,
                        price: Number(req.px),
                        leverage: 10,
                        volume: Number(req.sz),
                        trade_at: req.trade_at,
                        leverage: req.lever,
                        entry_price: req.orderType == "market" ? req.market : req.px,
                        trade_in: "imperial"
                      };
                      copTrade(user, req, data);
                      const tdata = await trade
                        .create(data)
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
                  .catch((err) => {
                    res.status(400).json({
                      success: false,
                      result: "",
                      message: err?.response?.data?.msg,
                    });
                  });
              }
            } else {
              res.status(400).json({
                success: false,
                result: "",
                message: "Invalid trade pairs",
              });
            }
          }
        } else if (req.trade_at === "Margin" && req.tdMode === "cross") {
          let datas = JSON.stringify({
            instId: req.instId,
            lever: req.lever,
            mgnMode: req.tdMode,
          });
          const data = await imperialApiAxios(
            "post",
            `https://www.okx.com/api/v5/account/set-leverage`,
            `/api/v5/account/set-leverage${datas}`,
            datas,
            copytradedetail[0].apikey,
            copytradedetail[0].secretkey,
            copytradedetail[0].passphrase,
          );
          if (data.code === "0") {
            if (assertpair) {
              if (req.orderType === "market") {
                let data = JSON.stringify({
                  instId: req.instId,
                  tdMode: req.tdMode,
                  ccy: req.ccy,
                  tag: req.tag,
                  side: req.side,
                  ordType: req.orderType,
                  sz: req.sz,
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
                    iosTime + "POST" + `/api/v5/trade/order${data}`, copytradedetail[0].secretkey
                  )
                );

                let config = {
                  method: "post",
                  maxBodyLength: Infinity,
                  url: `https://www.okx.com/api/v5/trade/order`,
                  headers: {
                    "Content-Type": "application/json",
                    "OK-ACCESS-KEY": copytradedetail[0].apikey ? copytradedetail[0].apikey : "93975967-ed47-4070-a436-329e22e14a1b",
                    "OK-ACCESS-SIGN": sign,
                    "OK-ACCESS-PASSPHRASE": copytradedetail[0].passphrase ? copytradedetail[0].passphrase : "Pass@123",
                    "OK-ACCESS-TIMESTAMP": iosTime,
                    "TEXT-TO-SIGN": textToSign,
                    Cookie: "locale=en-US",
                  },
                  data: data,
                };
                await axios
                  .request(config)
                  .then(async (ress) => {
                    if (ress.data.code === "0") {
                      const data = {
                        user_id: user._id,
                        loan_user_id: user._id,
                        trade_pair_id: assertpair._id,
                        asset_id: ASSETS?._id ? ASSETS?._id : assertpair._id,
                        trade_type: req.side,
                        ouid: "ouid",
                        symbol: req.instId.split("-")[0],
                        order_id: ress.data.data[0].ordId,
                        pair: req.instId,
                        order_type: req.orderType,
                        volume: Number(req.sz),
                        leverage: req.lever,
                        trade_at: req.trade_at,
                        entry_price: req.orderType == "market" ? req.market : req.px,
                        trade_in: "imperial"
                      };
                      copTrade(user, req, data);
                      const tdata = await trade
                        .create(data)
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
                        //     message: "Trade Not Created ",  //Createdddd
                        //   })
                        // );

                        res.status(200).json({
                              success: true,
                              result: "",
                              message: "Trade Created Successfully",
                            })

                    } else {
                      res.status(400).json({
                        success: false,
                        result: "",
                        message: ress.data.data[0].sMsg,
                      });
                    }
                  })
                  .catch((err) => { 
                res.status(400).json({
                  success: false,
                  result: "",
                  message: err?.response?.data?.msg,
                });
              });
              } else {
                let data = JSON.stringify({
                  instId: req.instId,
                  tdMode: req.tdMode,
                  ccy: req.ccy,
                  tag: req.tag,
                  side: req.side,
                  ordType: req.orderType,
                  sz: req.sz,
                  px: req.px,
                });
                var iosTime = new Date().toISOString();
                var method = "POST";
                var textToSign = "";
                textToSign += iosTime;
                textToSign += method;
                textToSign += `/api/v5/trade/order${data}`;

                var sign = CryptoJS.enc.Base64.stringify(
                  CryptoJS.HmacSHA256(
                    iosTime + "POST" + `/api/v5/trade/order${data}`, copytradedetail[0].secretkey
                  )
                );

                let config = {
                  method: "post",
                  maxBodyLength: Infinity,
                  url: `https://www.okx.com/api/v5/trade/order`,
                  headers: {
                    "Content-Type": "application/json",
                    "OK-ACCESS-KEY": copytradedetail[0].apikey ? copytradedetail[0].apikey : "93975967-ed47-4070-a436-329e22e14a1b",
                    "OK-ACCESS-SIGN": sign,
                    "OK-ACCESS-PASSPHRASE": copytradedetail[0].passphrase ? copytradedetail[0].passphrase : "Pass@123",
                    "OK-ACCESS-TIMESTAMP": iosTime,
                    "TEXT-TO-SIGN": textToSign,
                    Cookie: "locale=en-US",
                  },
                  data: data,
                };

                await axios
                  .request(config)
                  .then(async (ress) => {
                    if (ress.data.code === "0") {
                      const data = {
                        user_id: user._id,
                        loan_user_id: user._id,
                        trade_pair_id: assertpair._id,
                        asset_id: ASSETS?._id ? ASSETS?._id : assertpair._id,
                        trade_type: req.side,
                        ouid: "ouid",
                        symbol: req.instId.split("-")[0],
                        order_id: ress.data.data[0].ordId,
                        pair: req.instId,
                        order_type: req.orderType,
                        price: Number(req.px),
                        leverage: req.lever,
                        volume: Number(req.sz),
                        trade_at: req.trade_at,
                        entry_price: req.orderType == "market" ? req.market : req.px,
                        trade_in: "imperial"
                      };
                      copTrade(user, req, data);
                      const tdata = await trade
                        .create(data)
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
                  .catch((err) => {
                    res.status(400).json({
                      success: false,
                      result: "",
                      message: err?.response?.data?.msg,
                    });
                  });
              }
            } else {
              res.status(400).json({
                success: false,
                result: "",
                message: "Invalid trade pairs",
              });
            }
          }
        } else if (
          req.trade_at === "future-open-long" ||
          req.trade_at === "future-close-long"
        ) {
          const split = req.trade_at.split("-");
          if (split[1] === "open") {
            console.log("FUTURE OPEN ********************************");
            let datas;
            if(req.tdMode == "isolated"){
              datas = JSON.stringify({
                instId: req.instId,
                lever: req.lever,
                mgnMode: req.tdMode,
                posSide: "long",
              });
            } else if (req.tdMode == "cross"){
              datas = JSON.stringify({
                instId: req.instId,
                lever: req.lever,
                mgnMode: req.tdMode,
              });
            }
            
            const future_data = await imperialApiAxios(
              "post",
              `https://www.okx.com/api/v5/account/set-leverage`,
              `/api/v5/account/set-leverage${datas}`,
              datas,
              copytradedetail[0].apikey,
              copytradedetail[0].secretkey,
              copytradedetail[0].passphrase,
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

                  var iosTime = new Date().toISOString();
                  var method = "POST";
                  var textToSign = "";
                  textToSign += iosTime;
                  textToSign += method;
                  textToSign += `/api/v5/trade/order${data}`;

                  var sign = CryptoJS.enc.Base64.stringify(
                    CryptoJS.HmacSHA256(
                      iosTime + "POST" + `/api/v5/trade/order${data}`, copytradedetail[0].secretkey
                    )
                  );

                  let config = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: `https://www.okx.com/api/v5/trade/order`,
                    headers: {
                      "Content-Type": "application/json",
                      "OK-ACCESS-KEY": copytradedetail[0].apikey ? copytradedetail[0].apikey : "93975967-ed47-4070-a436-329e22e14a1b",
                      "OK-ACCESS-SIGN": sign,
                      "OK-ACCESS-PASSPHRASE": copytradedetail[0].passphrase ? copytradedetail[0].passphrase : "Pass@123",
                      "OK-ACCESS-TIMESTAMP": iosTime,
                      "TEXT-TO-SIGN": textToSign,
                      Cookie: "locale=en-US",
                    },
                    data: data,
                  };
                  await axios
                    .request(config)
                    .then(async (ress) => {
                      if (ress.data.code === "0") {
                        const data = {
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
                          entry_price: req.px
                        };
                        console.log(user, req, data,'********************************');
                        copTrade(user, req, data);
                        const tdata = await trade
                          .create(data)
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
                    .catch((err) => {
                      res.status(400).json({
                        success: false,
                        result: "",
                        message: err?.response?.data?.msg,
                      });
                    });
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
                  var iosTime = new Date().toISOString();
                  var method = "POST";
                  var textToSign = "";
                  textToSign += iosTime;
                  textToSign += method;
                  textToSign += `/api/v5/trade/order${data}`;

                  var sign = CryptoJS.enc.Base64.stringify(
                    CryptoJS.HmacSHA256(
                      iosTime + "POST" + `/api/v5/trade/order${data}`, copytradedetail[0].secretkey
                    )
                  );

                  let config = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: `https://www.okx.com/api/v5/trade/order`,
                    headers: {
                      "Content-Type": "application/json",
                      "OK-ACCESS-KEY": copytradedetail[0].apikey ? copytradedetail[0].apikey : "93975967-ed47-4070-a436-329e22e14a1b",
                      "OK-ACCESS-SIGN": sign,
                      "OK-ACCESS-PASSPHRASE": copytradedetail[0].passphrase ? copytradedetail[0].passphrase : "Pass@123",
                      "OK-ACCESS-TIMESTAMP": iosTime,
                      "TEXT-TO-SIGN": textToSign,
                      Cookie: "locale=en-US",
                    },
                    data: data,
                  };

                  await axios
                    .request(config)
                    .then(async (ress) => {
                      if (ress.data.code === "0") {
                        const data = {
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
                          entry_price: req.orderType == "market" ? req.market : req.px,
                          trade_in: "imperial"
                        };
                        console.log(user, req, data,'*************8888 ');
                        copTrade(user, req, data);
                        const tdata = await trade
                          .create(data)
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
                    .catch((err) => {
                      res.status(400).json({
                        success: false,
                        result: "",
                        message: err?.response?.data?.msg,
                      });
                    });
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

                var iosTime = new Date().toISOString();
                var method = "POST";
                var textToSign = "";
                textToSign += iosTime;
                textToSign += method;
                textToSign += `/api/v5/trade/order${data}`;

                var sign = CryptoJS.enc.Base64.stringify(
                  CryptoJS.HmacSHA256(
                    iosTime + "POST" + `/api/v5/trade/order${data}`, copytradedetail[0].secretkey
                  )
                );

                let config = {
                  method: "post",
                  maxBodyLength: Infinity,
                  url: `https://www.okx.com/api/v5/trade/order`,
                  headers: {
                    "Content-Type": "application/json",
                    "OK-ACCESS-KEY": copytradedetail[0].apikey ? copytradedetail[0].apikey : "93975967-ed47-4070-a436-329e22e14a1b",
                    "OK-ACCESS-SIGN": sign,
                    "OK-ACCESS-PASSPHRASE": copytradedetail[0].passphrase ? copytradedetail[0].passphrase : "Pass@123",
                    "OK-ACCESS-TIMESTAMP": iosTime,
                    "TEXT-TO-SIGN": textToSign,
                    Cookie: "locale=en-US",
                  },
                  data: data,
                };
                await axios
                  .request(config)
                  .then(async (ress) => {
                    if (ress.data.code === "0") {
                      const data = {
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
                        entry_price: req.orderType == "market" ? req.market : req.px,
                        trade_in: "imperial"
                      };
                      copTrade(user, req, data);
                      const tdata = await trade
                        .create(data)
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
                  .catch((err) => {
                    res.status(400).json({
                      success: false,
                      result: "",
                      message: err?.response?.data?.msg,
                    });
                  });
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
                var iosTime = new Date().toISOString();
                var method = "POST";
                var textToSign = "";
                textToSign += iosTime;
                textToSign += method;
                textToSign += `/api/v5/trade/order${data}`;

                var sign = CryptoJS.enc.Base64.stringify(
                  CryptoJS.HmacSHA256(
                    iosTime + "POST" + `/api/v5/trade/order${data}`, copytradedetail[0].secretkey
                  )
                );

                let config = {
                  method: "post",
                  maxBodyLength: Infinity,
                  url: `https://www.okx.com/api/v5/trade/order`,
                  headers: {
                    "Content-Type": "application/json",
                    "OK-ACCESS-KEY": copytradedetail[0].apikey ? copytradedetail[0].apikey : "93975967-ed47-4070-a436-329e22e14a1b",
                    "OK-ACCESS-SIGN": sign,
                    "OK-ACCESS-PASSPHRASE": copytradedetail[0].passphrase ? copytradedetail[0].passphrase : "Pass@123",
                    "OK-ACCESS-TIMESTAMP": iosTime,
                    "TEXT-TO-SIGN": textToSign,
                    Cookie: "locale=en-US",
                  },
                  data: data,
                };

                await axios
                  .request(config)
                  .then(async (ress) => {
                    if (ress.data.code === "0") {
                      const data = {
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
                        entry_price: req.orderType == "market" ? req.market : req.px,
                        trade_in: "imperial"
                      };
                      copTrade(user, req, data);
                      const tdata = await trade
                        .create(data)
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
                  .catch((err) => {
                    res.status(400).json({
                      success: false,
                      result: "",
                      message: err?.response?.data?.msg,
                    });
                  });
              }
            } else {
              res.status(400).json({
                success: false,
                result: "",
                message: "Invalid trade pairs",
              });
            }
          }
        } else if (
          req.trade_at === "future-open-short" ||
          req.trade_at === "future-close-short"
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
              copytradedetail[0].apikey,
              copytradedetail[0].secretkey,
              copytradedetail[0].passphrase,
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
                  var iosTime = new Date().toISOString();
                  var method = "POST";
                  var textToSign = "";
                  textToSign += iosTime;
                  textToSign += method;
                  textToSign += `/api/v5/trade/order${data}`;

                  var sign = CryptoJS.enc.Base64.stringify(
                    CryptoJS.HmacSHA256(
                      iosTime + "POST" + `/api/v5/trade/order${data}`, copytradedetail[0].secretkey
                    )
                  );

                  let config = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: `https://www.okx.com/api/v5/trade/order`,
                    headers: {
                      "Content-Type": "application/json",
                      "OK-ACCESS-KEY": copytradedetail[0].apikey ? copytradedetail[0].apikey : "93975967-ed47-4070-a436-329e22e14a1b",
                      "OK-ACCESS-SIGN": sign,
                      "OK-ACCESS-PASSPHRASE": copytradedetail[0].passphrase ? copytradedetail[0].passphrase : "Pass@123",
                      "OK-ACCESS-TIMESTAMP": iosTime,
                      "TEXT-TO-SIGN": textToSign,
                      Cookie: "locale=en-US",
                    },
                    data: data,
                  };
                  await axios
                    .request(config)
                    .then(async (ress) => {
                      if (ress.data.code === "0") {
                        const data = {
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
                          entry_price: req.orderType == "market" ? req.market : req.px,
                          trade_in: "imperial"
                        };
                        copTrade(user, req, data);
                        const tdata = await trade
                          .create(data)
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
                    .catch((err) => {
                      res.status(400).json({
                        success: false,
                        result: "",
                        message: err?.response?.data?.msg,
                      });
                    });
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

                  var iosTime = new Date().toISOString();
                  var method = "POST";
                  var textToSign = "";
                  textToSign += iosTime;
                  textToSign += method;
                  textToSign += `/api/v5/trade/order${data}`;

                  var sign = CryptoJS.enc.Base64.stringify(
                    CryptoJS.HmacSHA256(
                      iosTime + "POST" + `/api/v5/trade/order${data}`, copytradedetail[0].secretkey
                    )
                  );

                  let config = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: `https://www.okx.com/api/v5/trade/order`,
                    headers: {
                      "Content-Type": "application/json",
                      "OK-ACCESS-KEY": copytradedetail[0].apikey ? copytradedetail[0].apikey : "93975967-ed47-4070-a436-329e22e14a1b",
                      "OK-ACCESS-SIGN": sign,
                      "OK-ACCESS-PASSPHRASE": copytradedetail[0].passphrase ? copytradedetail[0].passphrase : "Pass@123",
                      "OK-ACCESS-TIMESTAMP": iosTime,
                      "TEXT-TO-SIGN": textToSign,
                      Cookie: "locale=en-US",
                    },
                    data: data,
                  };

                  await axios
                    .request(config)
                    .then(async (ress) => {
                      if (ress.data.code === "0") {
                        const data = {
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
                          entry_price: req.orderType == "market" ? req.market : req.px,
                          trade_in: "imperial"
                        };
                        copTrade(user, req, data);
                        const tdata = await trade
                          .create(data)
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
                    .catch((err) => {
                      res.status(400).json({
                        success: false,
                        result: "",
                        message: err?.response?.data?.msg,
                      });
                    });
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
                    "CBB7D9C9B6426A6562D2741A1E8AC9A6"
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
                    "OK-ACCESS-PASSPHRASE": "Pass@123",
                    "OK-ACCESS-TIMESTAMP": iosTime,
                    "TEXT-TO-SIGN": textToSign,
                    Cookie: "locale=en-US",
                  },
                  data: data,
                };
                await axios
                  .request(config)
                  .then(async (ress) => {
                    if (ress.data.code === "0") {
                      const data = {
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
                        entry_price: req.orderType == "market" ? req.market : req.px,
                        trade_in: "imperial"
                      };
                      copTrade(user, req, data);
                      const tdata = await trade
                        .create(data)
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
                  .catch((err) => {
                    res.status(400).json({
                      success: false,
                      result: "",
                      message: err?.response?.data?.msg,
                    });
                  });
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
                    "CBB7D9C9B6426A6562D2741A1E8AC9A6"
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
                    "OK-ACCESS-PASSPHRASE": "Pass@123",
                    "OK-ACCESS-TIMESTAMP": iosTime,
                    "TEXT-TO-SIGN": textToSign,
                    Cookie: "locale=en-US",
                  },
                  data: data,
                };

                await axios
                  .request(config)
                  .then(async (ress) => {
                    if (ress.data.code === "0") {
                      const data = {
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
                        entry_price: req.orderType == "market" ? req.market : req.px,
                        trade_in: "imperial"
                      };
                      copTrade(user, req, data);
                      const tdata = await trade
                        .create(data)
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
                  .catch((err) => {
                    res.status(400).json({
                      success: false,
                      result: "",
                      message: err?.response?.data?.msg,
                    });
                  });
              }
            } else {
              res.status(400).json({
                success: false,
                result: "",
                message: "Invalid trade pairs",
              });
            }
          }
        }
      } else {
        res.status(400).json({
          success: false,
          result: "",
          message: "You didn't provide apikey,securitykey,passphrase",
        });
      }



    } else {
      res.status(400).json({
        success: false,
        result: "",
        message: "Unauthorized way",
      });
    }
  } catch (error) {
    console.log(error, '************');
    handleError(res, error);
  }
};

module.exports = { createTrade };
