const copytrade = require("../../models/copytrade");
const { handleError } = require("../../middleware/utils");
const axios = require("axios");
const CryptoJS = require("crypto-js");


const modifyIp = async (req, res) => {
try {
    
    const user = req.user;

    const secretData = await copytrade.findOne({ user_id: user._id });

    let data = JSON.stringify({
        subAcct : req.body.subAcct,
        apiKey : req.body.apiKey,
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
                res.status(200).json({
                    success: true,
                    result: "",
                    message: "Api Key Created SuccessFully"
                });

            } else {
                res.status(200).json({
                    success: false,
                    result: "",
                    message: "Api Key Not Created"
                });

            }
          })

} catch (error) {
    handleError(res, error);
}

}


module.exports = { modifyIp };