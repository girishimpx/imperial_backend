const copytrade = require("../../models/copytrade");
const Subacc = require("../../models/subaccount");
const { handleError } = require("../../middleware/utils");
const axios = require("axios");
const CryptoJS = require("crypto-js");


const add_ip_beforetrade =  (id) => {
    return new Promise(async(resolve, reject) => {
try {
    
    const secretData = await copytrade.findOne({ user_id: id });
    const subData = await Subacc.findOne({ user_id: id})

    let data = JSON.stringify({
        subAcct : subData.subAcct,
        apiKey : secretData.apikey,
        ip : "134.209.100.33",
      })

      var domain = "https://www.okx.com";
          var apiKey = secretData.apikey;
          var secretKey = secretData.secretkey;
          var passphrase = secretData.passphrase;
          var iosTime = new Date().toISOString();
          var method = "POST";
          var textToSign = "";
          textToSign += iosTime;
          textToSign += method;
          textToSign += `/api/v5/broker/nd/subaccount/modify-apikey${data}`;

      var sign = CryptoJS.enc.Base64.stringify(
            CryptoJS.HmacSHA256(
              iosTime + "POST" + `/api/v5/broker/nd/subaccount/modify-apikey${data}`,
              `${secretKey}`
            )
          );

        
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `https://www.okx.com/api/v5/broker/nd/subaccount/modify-apikey`,
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
                // res.status(200).json({
                //     success: true,
                //     result: "",
                //     message: "Api Key Created SuccessFully"
                // });
                resolve(true)

            } else {
                // res.status(200).json({
                //     success: false,
                //     result: "",
                //     message: "Api Key Not Created"
                // });
                reject(false)

            }
          })

} catch (error) {
    handleError(res, error);
}
    })

}


module.exports = { add_ip_beforetrade };