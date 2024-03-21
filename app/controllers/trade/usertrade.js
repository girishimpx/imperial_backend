const trade = require("../../models/trade");
const { handleError } = require("../../middleware/utils");
const { matchedData } = require("express-validator");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const tradePAirs = require("../../models/tradePairs");
const futurePairs = require("../../models/allTickers");
const ASSETS = require("../../models/assets");
const copytrade = require("../../models/copytrade");
const {
  imperialApiAxios,
} = require("../../middleware/ImperialApi/imperialApi");
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const userTrade = async (req, res) => {
  try {
    console.log("users");
    const user = req.user;
    req = matchedData(req);
  console.log(req.instId,'**************************************');
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
    const keydata = await copytrade.findOne({ user_id: user._id });

    if (req.trade_at === "spot") {
      console.log(
        {
          instId: req.instId,
          tdMode: req.tdMode,
          ccy: req.ccy,
          tag: req.tag,
          side: req.side,
          ordType: req.orderType,
          sz: req.sz,
        },
        "tradessss"
      );
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
          var apiKey = keydata.apikey;
          var secretKey = keydata.secretkey;
          var passphrase = keydata.passphrase;
          var iosTime = new Date().toISOString();
          var method = "POST";
          var textToSign = "";
          textToSign += iosTime;
          textToSign += method;
          textToSign += `/api/v5/trade/order${data}`;

          var sign = CryptoJS.enc.Base64.stringify(
            CryptoJS.HmacSHA256(
              iosTime + "POST" + `/api/v5/trade/order${data}`,
              `${secretKey}`
            )
          );

          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `https://www.okx.com/api/v5/trade/order`,
            headers: {
              "Content-Type": "application/json",
              "OK-ACCESS-KEY": apiKey,
              "OK-ACCESS-SIGN": sign,
              "OK-ACCESS-PASSPHRASE": passphrase,
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
                  leverage: req.lever,
                  trade_at: req.trade_at,
                  entry_price: req.orderType == "market" ? req.market : req.px,
                  trade_in: "okx",
                };
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
            sz: req.sz,
            px: req.px,
          });
          var domain = "https://www.okx.com";
          var apiKey = keydata.apikey;
          var secretKey = keydata.secretkey;
          var passphrase = keydata.passphrase;
          var iosTime = new Date().toISOString();
          var method = "POST";
          var textToSign = "";
          textToSign += iosTime;
          textToSign += method;
          textToSign += `/api/v5/trade/order${data}`;

          var sign = CryptoJS.enc.Base64.stringify(
            CryptoJS.HmacSHA256(
              iosTime + "POST" + `/api/v5/trade/order${data}`,
              `${secretKey}`
            )
          );
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `https://www.okx.com/api/v5/trade/order`,
            headers: {
              "Content-Type": "application/json",
              "OK-ACCESS-KEY": apiKey,
              "OK-ACCESS-SIGN": sign,
              "OK-ACCESS-PASSPHRASE": passphrase,
              "OK-ACCESS-TIMESTAMP": iosTime,
              "x-simulated-trading":0,
              "TEXT-TO-SIGN": textToSign,
              Cookie: "locale=en-US",
            },
            data: data,
          };
          console.log(config,'CONFFIGGG');
          await axios
            .request(config)
            .then(async (ress) => {
              console.log(ress.data.data,'ress');
              if (ress.data.code == "0") {
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
                  leverage: req.lever,
                  trade_at: req.trade_at,
                  entry_price: req.orderType == "market" ? req.market : req.px,
                  trade_in: "okx",
                };
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
        keydata.apikey,
        keydata.secretkey,
        keydata.passphrase
      );
      if (data.code === "0") {
        if (assertpair) {
          if (req.orderType === "market") {
            const usdtBalance = parseFloat(balance?.find(item => item.symbol === "USDT")?.balance);
            let data = JSON.stringify({
              instId: req.instId,
              tdMode: req.tdMode,
              ccy: req.ccy,
              tag: req.tag,
              side: req.side,
              ordType: req.orderType,
              sz: (req.sz * usdtBalance / 100) ,
            });

            var domain = "https://www.okx.com";
            var apiKey = keydata.apikey;
            var secretKey = keydata.secretkey;
            var passphrase = keydata.passphrase;
            var iosTime = new Date().toISOString();
            var method = "POST";
            var textToSign = "";
            textToSign += iosTime;
            textToSign += method;
            textToSign += `/api/v5/trade/order${data}`;

            var sign = CryptoJS.enc.Base64.stringify(
              CryptoJS.HmacSHA256(
                iosTime + "POST" + `/api/v5/trade/order${data}`,
                `${secretKey}`
              )
            );

            let config = {
              method: "post",
              maxBodyLength: Infinity,
              url: `https://www.okx.com/api/v5/trade/order`,
              headers: {
                "Content-Type": "application/json",
                "OK-ACCESS-KEY": apiKey,
                "OK-ACCESS-SIGN": sign,
                "OK-ACCESS-PASSPHRASE": passphrase,
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
                    entry_price:
                      req.orderType == "market" ? req.market : req.px,
                    trade_in: "okx",
                  };
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
              sz: (req.sz * usdtBalance / 100),
              px: req.px,
            });

            var domain = "https://www.okx.com";
            var apiKey = keydata.apikey;
            var secretKey = keydata.secretkey;
            var passphrase = keydata.passphrase;
            var iosTime = new Date().toISOString();
            var method = "POST";
            var textToSign = "";
            textToSign += iosTime;
            textToSign += method;
            textToSign += `/api/v5/trade/order${data}`;

            var sign = CryptoJS.enc.Base64.stringify(
              CryptoJS.HmacSHA256(
                iosTime + "POST" + `/api/v5/trade/order${data}`,
                `${secretKey}`
              )
            );

            let config = {
              method: "post",
              maxBodyLength: Infinity,
              url: `https://www.okx.com/api/v5/trade/order`,
              headers: {
                "Content-Type": "application/json",
                "OK-ACCESS-KEY": apiKey,
                "OK-ACCESS-SIGN": sign,
                "OK-ACCESS-PASSPHRASE": passphrase,
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
                    entry_price:
                      req.orderType == "market" ? req.market : req.px,
                    trade_in: "okx",
                  };
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
      } else {
        res.status(400).json({
          success: false,
          result: "",
          message: data.msg,
        });
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
        keydata.apikey,
        keydata.secretkey,
        keydata.passphrase
      );
      if (data.code === "0") {
        console.log('success leverage');
        if (assertpair) {
          if (req.orderType === "market") {
            console.log('market');
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
            var apiKey = keydata.apikey;
            var secretKey = keydata.secretkey;
            var passphrase = keydata.passphrase;
            var iosTime = new Date().toISOString();
            var method = "POST";
            var textToSign = "";
            textToSign += iosTime;
            textToSign += method;
            textToSign += `/api/v5/trade/order${data}`;

            var sign = CryptoJS.enc.Base64.stringify(
              CryptoJS.HmacSHA256(
                iosTime + "POST" + `/api/v5/trade/order${data}`,
                `${secretKey}`
              )
            );

            let config = {
              method: "post",
              maxBodyLength: Infinity,
              url: `https://www.okx.com/api/v5/trade/order`,
              headers: {
                "Content-Type": "application/json",
                "OK-ACCESS-KEY": apiKey,
                "OK-ACCESS-SIGN": sign,
                "OK-ACCESS-PASSPHRASE": passphrase,
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
                    leverage: 10,
                    trade_at: req.trade_at,
                    entry_price:
                      req.orderType == "market" ? req.market : req.px,
                    trade_in: "okx",
                  };
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
            console.log('limit');
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
            var apiKey = keydata.apikey;
            var secretKey = keydata.secretkey;
            var passphrase = keydata.passphrase;
            var iosTime = new Date().toISOString();
            var method = "POST";
            var textToSign = "";
            textToSign += iosTime;
            textToSign += method;
            textToSign += `/api/v5/trade/order${data}`;

            var sign = CryptoJS.enc.Base64.stringify(
              CryptoJS.HmacSHA256(
                iosTime + "POST" + `/api/v5/trade/order${data}`,
                `${secretKey}`
              )
            );

            let config = {
              method: "post",
              maxBodyLength: Infinity,
              url: `https://www.okx.com/api/v5/trade/order`,
              headers: {
                "Content-Type": "application/json",
                "OK-ACCESS-KEY": apiKey,
                "OK-ACCESS-SIGN": sign,
                "OK-ACCESS-PASSPHRASE": passphrase,
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
                    entry_price:
                      req.orderType == "market" ? req.market : req.px,
                    trade_in: "okx",
                  };
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
      console.log("future");
      const split = req.trade_at.split("-");
      if (split[1] === "open") {
        let datas;
        if(req.tdMode === "isolated"){
           datas = JSON.stringify({
            instId: req.instId,
            lever: req.lever,
            mgnMode: req.tdMode,
            // ordType: req.orderType,
            // ccy : req.ccy,    
             posSide: "long", 
          });
        } else if(req.tdMode === "cross"){
          console.log("fu-cross");
           datas = JSON.stringify({
            instId: req.instId,
            lever: req.lever,
            mgnMode: req.tdMode,
            // ordType: req.orderType,
            // ccy : req.ccy,    
            //  posSide: "long", 
          });
          
        } 
        else {
        // console.log('**************************************************************************************************');
          datas = JSON.stringify({
            instId: req.instId,
            lever: req.lever,
        ordType: req.orderType,
        ccy : req.ccy,    
             posSide: "long"
          });
        }
        
        // console.log(datas,'datas********************************');
        const future_data = await imperialApiAxios(
          "post",
          `https://www.okx.com/api/v5/account/set-leverage`,
          `/api/v5/account/set-leverage${datas}`,
          datas,
          keydata.apikey,
          keydata.secretkey,
          keydata.passphrase
        );
        console.log(future_data,"lever-fu");
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

              console.log(data,"future");

              var domain = "https://www.okx.com";
              var apiKey = keydata.apikey;
              var secretKey = keydata.secretkey;
              var passphrase = keydata.passphrase;
              var iosTime = new Date().toISOString();
              var method = "POST";
              var textToSign = "";
              textToSign += iosTime;
              textToSign += method;
              textToSign += `/api/v5/trade/order${data}`;

              var sign = CryptoJS.enc.Base64.stringify(
                CryptoJS.HmacSHA256(
                  iosTime + "POST" + `/api/v5/trade/order${data}`,
                  `${secretKey}`
                )
              );

              let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: `https://www.okx.com/api/v5/trade/order`,
                headers: {
                  "Content-Type": "application/json",
                  "OK-ACCESS-KEY": apiKey,
                  "OK-ACCESS-SIGN": sign,
                  "OK-ACCESS-PASSPHRASE": passphrase,
                  "OK-ACCESS-TIMESTAMP": iosTime,
                  "TEXT-TO-SIGN": textToSign,
                  Cookie: "locale=en-US",
                },
                data: data,
              };

              console.log(config,"future")


              await axios
                .request(config)
                .then(async (ress) => {
                  console.log(ress,"future");
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
                      trade_in: "okx",
                    };
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
              console.log("limit-fut");
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
              var apiKey = keydata.apikey;
              var secretKey = keydata.secretkey;
              var passphrase = keydata.passphrase;
              var iosTime = new Date().toISOString();
              var method = "POST";
              var textToSign = "";
              textToSign += iosTime;
              textToSign += method;
              textToSign += `/api/v5/trade/order${data}`;

              var sign = CryptoJS.enc.Base64.stringify(
                CryptoJS.HmacSHA256(
                  iosTime + "POST" + `/api/v5/trade/order${data}`,
                  `${secretKey}`
                )
              );

              let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: `https://www.okx.com/api/v5/trade/order`,
                headers: {
                  "Content-Type": "application/json",
                  "OK-ACCESS-KEY": apiKey,
                  "OK-ACCESS-SIGN": sign,
                  "OK-ACCESS-PASSPHRASE": passphrase,
                  "OK-ACCESS-TIMESTAMP": iosTime,
                  "TEXT-TO-SIGN": textToSign,
                  Cookie: "locale=en-US",
                },
                data: data,
              };
              
              console.log(config,'success')
              await axios
                .request(config)
                .then(async (ress) => {
                  console.log(ress.data,'ress')
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
                      trade_in: "okx",
                    };
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
        } else {
          res.status(400).json({
              success: false,
              result: "",
              message: future_data.msg,
            });
        }
      } else {
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
              posSide: "long",
              sz: req.lever,
            });

            var domain = "https://www.okx.com";
            var apiKey = keydata.apikey;
            var secretKey = keydata.secretkey;
            var passphrase = keydata.passphrase;
            var iosTime = new Date().toISOString();
            var method = "POST";
            var textToSign = "";
            textToSign += iosTime;
            textToSign += method;
            textToSign += `/api/v5/trade/order${data}`;

            var sign = CryptoJS.enc.Base64.stringify(
              CryptoJS.HmacSHA256(
                iosTime + "POST" + `/api/v5/trade/order${data}`,
                `${secretKey}`
              )
            );

            let config = {
              method: "post",
              maxBodyLength: Infinity,
              url: `https://www.okx.com/api/v5/trade/order`,
              headers: {
                "Content-Type": "application/json",
                "OK-ACCESS-KEY": apiKey,
                "OK-ACCESS-SIGN": sign,
                "OK-ACCESS-PASSPHRASE": passphrase,
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
                    trade_in: "okx",
                  };
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
            var apiKey = keydata.apikey;
            var secretKey = keydata.secretkey;
            var passphrase = keydata.passphrase;
            var iosTime = new Date().toISOString();
            var method = "POST";
            var textToSign = "";
            textToSign += iosTime;
            textToSign += method;
            textToSign += `/api/v5/trade/order${data}`;

            var sign = CryptoJS.enc.Base64.stringify(
              CryptoJS.HmacSHA256(
                iosTime + "POST" + `/api/v5/trade/order${data}`,
                `${secretKey}`
              )
            );

            let config = {
              method: "post",
              maxBodyLength: Infinity,
              url: `https://www.okx.com/api/v5/trade/order`,
              headers: {
                "Content-Type": "application/json",
                "OK-ACCESS-KEY": apiKey,
                "OK-ACCESS-SIGN": sign,
                "OK-ACCESS-PASSPHRASE": passphrase,
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
                    trade_in: "okx",
                  };
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
          keydata.apikey,
          keydata.secretkey,
          keydata.passphrase
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
              var apiKey = keydata.apikey;
              var secretKey = keydata.secretkey;
              var passphrase = keydata.passphrase;
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
                  "OK-ACCESS-KEY": apiKey,
                  "OK-ACCESS-SIGN": sign,
                  "OK-ACCESS-PASSPHRASE": passphrase,
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
                      trade_in: "okx",
                    };
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

              var domain = "https://www.okx.com";
              var apiKey = keydata.apikey;
              var secretKey = keydata.secretkey;
              var passphrase = keydata.passphrase;
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
                  "OK-ACCESS-KEY": apiKey,
                  "OK-ACCESS-SIGN": sign,
                  "OK-ACCESS-PASSPHRASE": passphrase,
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
                      trade_in: "okx",
                    };
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
            var apiKey = keydata.apikey;
            var secretKey = keydata.secretkey;
            var passphrase = keydata.passphrase;
            var iosTime = new Date().toISOString();
            var method = "POST";
            var textToSign = "";
            textToSign += iosTime;
            textToSign += method;
            textToSign += `/api/v5/trade/order${data}`;

            var sign = CryptoJS.enc.Base64.stringify(
              CryptoJS.HmacSHA256(
                iosTime + "POST" + `/api/v5/trade/order${data}`,
                `${secretKey}`
              )
            );

            let config = {
              method: "post",
              maxBodyLength: Infinity,
              url: `https://www.okx.com/api/v5/trade/order`,
              headers: {
                "Content-Type": "application/json",
                "OK-ACCESS-KEY": apiKey,
                "OK-ACCESS-SIGN": sign,
                "OK-ACCESS-PASSPHRASE": passphrase,
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
                    trade_in: "okx",
                  };
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
            var apiKey = keydata.apikey;
            var secretKey = keydata.secretkey;
            var passphrase = keydata.passphrase;
            var iosTime = new Date().toISOString();
            var method = "POST";
            var textToSign = "";
            textToSign += iosTime;
            textToSign += method;
            textToSign += `/api/v5/trade/order${data}`;

            var sign = CryptoJS.enc.Base64.stringify(
              CryptoJS.HmacSHA256(
                iosTime + "POST" + `/api/v5/trade/order${data}`,
                `${secretKey}`
              )
            );

            let config = {
              method: "post",
              maxBodyLength: Infinity,
              url: `https://www.okx.com/api/v5/trade/order`,
              headers: {
                "Content-Type": "application/json",
                "OK-ACCESS-KEY": apiKey,
                "OK-ACCESS-SIGN": sign,
                "OK-ACCESS-PASSPHRASE": passphrase,
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
                    trade_in: "okx",
                  };
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
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { userTrade };
