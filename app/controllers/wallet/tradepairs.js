const axios = require("axios");
const CryptoJS = require("crypto-js");
const {
  imperialApiAxios,
} = require("../../middleware/ImperialApi/imperialApi");
const future = require("../../models/futurePairs");
const tradePairss = require("../../models/tradePairs");

const tradepairs = async (req, res) => {
  try {
    const data = await imperialApiAxios(
      "get",
      `https://www.imperialx.exchange/api/v5/public/instruments?instType=SPOT`,
      `/api/v5/public/instruments?instType=SPOT`,
      {},
      "93975967-ed47-4070-a436-329e22e14a1b",
      "CBB7D9C9B6426A6562D2741A1E8AC9A6",
      "Pass@123"
    );

    if (data.data.length > 0) {
      for (let i = 0; i < data.data.length; i++) {
        var dts = {
          tradepair: data?.data[i]?.instId,
          coinname1: data?.data[i]?.quoteCcy,
          coinname2: data?.data[i]?.baseCcy,
        };
        await tradePairss.create(dts);
        //   if (data.data[i].instId.split("-")[1] != "USD") {
        //     const obj = {
        //       alias: data.data[i].alias,
        //       instFamily: data.data[i].instFamily,
        //       instId: data.data[i].instId,
        //       instType: data.data[i].instType,
        //       lever: data.data[i].lever,
        //       state: data.data[i].state,
        //       tickSz: data.data[i].tickSz,
        //       uly: data.data[i].uly,
        //       others: data.data[i],
        //     };
        //     const dt = await future.findOne({
        //       alias: obj.alias,
        //       instFamily: obj.instFamily,
        //     });
        //     if (dt) {
        //       const update = await future.findByIdAndUpdate({ _id: dt._id }, obj);
        //     } else {
        //       const up = await future.create(obj);
        //     }
        //   }
      }
      res.status(200).json({
        success: true,
        result: data?.data,
        message: "Data found",
      });
    }
  } catch (error) {
    console.log(error, "err");
  }
};

module.exports = { tradepairs };
