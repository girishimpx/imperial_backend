const axios = require("axios");
const CryptoJS = require("crypto-js");

const levrageSet = async (instId, lever, mgnMode ) => {
  return new Promise( async(resolve, reject) => {
    let data =JSON.stringify({"instId":instId,"lever":lever,"mgnMode":mgnMode}) 

    console.log(data,"data")
      var domain = "https://www.imperialx.exchange";
      var apiKey = "622e4d02-dd52-428e-a8bf-357836b96628";
      var secretKey = "458015C86ECB5D0250389BB0DD299722";
      var passphrase = "Test@1530";
      var iosTime = new Date().toISOString();
      var method = "POST";
      var textToSign = "";
      textToSign += iosTime;
      textToSign += method;
      textToSign += `/api/v5/account/set-leverage`;

      var sign = CryptoJS.enc.Base64.stringify(
        CryptoJS.HmacSHA256(
          iosTime + "POST" + `/api/v5/account/set-leverage`,
          "458015C86ECB5D0250389BB0DD299722"
        )
      );


      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `https://www.imperialx.exchange/api/v5/account/set-leverage`,
        headers: {
          "Content-Type": "application/json",
          "OK-ACCESS-KEY": "622e4d02-dd52-428e-a8bf-357836b96628",
          "OK-ACCESS-SIGN": sign,
          "OK-ACCESS-PASSPHRASE": "Test@1530",
          "OK-ACCESS-TIMESTAMP": iosTime,
          "TEXT-TO-SIGN": textToSign,
          Cookie: "locale=en-US",
        },
        data: data,
      };
      console.log(data,"data")
      await axios
      .request(config)
      .then((response) => {
        console.log(response.data,"response")
        resolve(response.data);
      })
      .catch((error) => {
        reject(error,"errs");


      });
  });
};

module.exports = { levrageSet };