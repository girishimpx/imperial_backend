const trade = require("../../models/trade");
const { createItem } = require("../../middleware/db");
const { handleError } = require("../../middleware/utils");
const { matchedData } = require("express-validator");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const Trade = require("../../models/trade");
const tradePAirs = require("../../models/tradePairs");
const ASSETS = require("../../models/assets");
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const tradeStatus = async () => {
  try {
    // let app = await Trade.find({ status: { $ne: "filled" } });
    let app = await Trade.aggregate([
      { $match: { $and: [{ status: { $ne: "filled" } }, { status: { $ne: "canceled" } }] } },
      {
        $lookup: {
          from: 'copytrades',
          localField: 'user_id',
          foreignField: 'user_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user'
      }
    ]);
    // console.log("🚀 ~ file: creonjob.js:21 ~ tradeStatus ~ app:", app)
    // let app = await Trade.find();

    if (app.length > 0) {
      for (let i = 0; i < app.length; i++) {
        var domain = "https://www.okx.com";
        var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
        var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
        var passphrase = "Pass@123";
        var iosTime = new Date().toISOString();
        var method = "GET";
        var textToSign = "";
        textToSign += iosTime;
        textToSign += method;
        textToSign += `/api/v5/trade/order?instId=${app[i].pair}&ordId=${app[i].order_id}`;
        var sign = CryptoJS.enc.Base64.stringify(
          CryptoJS.HmacSHA256(
            iosTime +
            "GET" +
            `/api/v5/trade/order?instId=${app[i].pair}&ordId=${app[i].order_id}`,
            `${app[i]?.user?.secretkey}`
          )
        );

        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `https://www.okx.com/api/v5/trade/order?instId=${app[i].pair}&ordId=${app[i].order_id}`,
          headers: {
            "Content-Type": "application/json",
            "OK-ACCESS-KEY": app[i]?.user?.apikey,
            "OK-ACCESS-SIGN": sign,
            "OK-ACCESS-PASSPHRASE": app[i]?.user?.passphrase,
            "OK-ACCESS-TIMESTAMP": iosTime,
            "TEXT-TO-SIGN": textToSign,
            Cookie: "locale=en-US",
          },
        };

        axios
          .request(config)
          .then((response) => {
            if (response.data.code == 0) {
              Trade.findByIdAndUpdate(
                { _id: app[i]._id },
                { status: response.data.data[0].state, tradeId: response.data.data[0].tradeId, exit_price: response.data.data[0].fillPx },
                async (err, done) => {
                  if (err) {
                    // return console.log(err);
                  }
                  if (done) {
                    // return console.log("status updated successfully");
                  }
                }
              );
            } else {
              // console.log(response.data);
            }
          })
          .catch((error) => {
            // console.log("error");
            // console.log(error);
          });
      }
    } else {
      // console.log("Data Not Found");
    }


    let future = await Trade.find({ trade_at: "future", status: "filled" })

    if (future.length > 0) {
      for (let i = 0; i < future.length; i++) {
        var domain = "https://www.imperialx.exchange";
        var apiKey = "93975967-ed47-4070-a436-329e22e14a1b";
        var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
        var passphrase = "Pass@123";
        var iosTime = new Date().toISOString();
        var method = "GET";
        var textToSign = "";
        textToSign += iosTime;
        textToSign += method;
        textToSign += `/api/v5/account/positions?instId=${future[i].pair}&instType=FUTURES`;


        var sign = CryptoJS.enc.Base64.stringify(
          CryptoJS.HmacSHA256(
            iosTime +
            "GET" +
            `/api/v5/account/positions?instId=${future[i].pair}&instType=FUTURES`,
            "CBB7D9C9B6426A6562D2741A1E8AC9A6"
          )
        );

        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `https://www.imperialx.exchange/api/v5/account/positions?instId=${future[i].pair}&instType=FUTURES`,
          headers: {
            "Content-Type": "application/json",
            "OK-ACCESS-KEY": "93975967-ed47-4070-a436-329e22e14a1b",
            "OK-ACCESS-SIGN": sign,
            "OK-ACCESS-PASSPHRASE": "Pass@123",
            "OK-ACCESS-TIMESTAMP": iosTime,
            "TEXT-TO-SIGN": textToSign,
            Cookie: "locale=en-US",
          },
        };

        axios
          .request(config)
          .then((response) => {
            if (response.data.code == 0) {
              for (let j = 0; j < response.data.data.length; j++) {
                const dt = response.data.data[j]
                if (dt.tradeId === future[i].tradeId) {
                  Trade.findByIdAndUpdate(
                    { _id: future[i]._id },
                    { posId: dt.posId, posStatus: dt.pos },
                    async (err, done) => {
                      if (err) {
                        // return console.log(err);
                      }
                      if (done) {
                        const d = await Trade.updateMany(
                          { posId: dt.posId },
                          { posStatus: dt.pos }
                        )
                        // return console.log("status updated successfully");
                      }
                    }
                  );
                }

              }
            } else {
              // console.log(response.data);
            }
          })
          .catch((error) => {
            // console.log("error");
            // console.log(error);
          });
      }
    } else {
      // console.log("Data Not Found");
    }

  } catch (error) {
    // console.log(error, "handle error");
  }
};





module.exports = { tradeStatus };
