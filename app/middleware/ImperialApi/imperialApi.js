const axios = require("axios");
const CryptoJS = require("crypto-js");

const imperialApiAxios = async (METHOD, url, path, data, apiKey, secretKey, passphrase) => {
  // console.log(data, apiKey, secretKey, passphrase,'postionshistory');
  // console.log(url,path,"position-path");
  return new Promise(async (resolve, reject) => {
    var domain = "https://www.okx.com";
    // var apiKey = "93975967-ed47-4070-a436-329e22e14a1b"; 
    // var secretKey = "CBB7D9C9B6426A6562D2741A1E8AC9A6";
    // var passphrase = "Pass@123";
    var iosTime = new Date().toISOString();
    console.log(iosTime,'iosTime');
    var method = METHOD.toUpperCase();
    var textToSign = "";
    textToSign += iosTime;
    textToSign += method;
    textToSign += path;
    var sign = CryptoJS.enc.Base64.stringify(
      CryptoJS.HmacSHA256(iosTime + method + path, secretKey)
    );

      // console.log(path,sign,"path and sign");

    let config;
    if (METHOD == "post") {
      config = {
        method: METHOD,
        maxBodyLength: Infinity,
        url: url,
        headers: {
          "Content-Type": "application/json",
          // "x-simulated-trading": 1,
          "x-simulated-trading": 0,
          "OK-ACCESS-KEY": apiKey,
          "OK-ACCESS-SIGN": sign,
          "OK-ACCESS-PASSPHRASE": passphrase ? passphrase : "Pass@123",
          "OK-ACCESS-TIMESTAMP": iosTime,
          "TEXT-TO-SIGN": textToSign,
          Cookie: "locale=en-US",
        },
        data: data,
      };
    } else {
      config = {
        method: METHOD,
        maxBodyLength: Infinity,
        url: url,
        headers: {
          "Content-Type": "application/json",
          // "x-simulated-trading": 1,
          "x-simulated-trading": 0,
          "OK-ACCESS-KEY": apiKey,
          "OK-ACCESS-SIGN": sign,
          "OK-ACCESS-PASSPHRASE": passphrase ? passphrase : "Pass@123",
          "OK-ACCESS-TIMESTAMP": iosTime,
          "TEXT-TO-SIGN": textToSign,
          Cookie: "locale=en-US",
        },
      };
    }
  // console.log(config,'CONFIG*********');
    await axios
      .request(config)
      .then((response) => {
        
        if(response.data.code != '0'){
          reject(response.data)
        }
        resolve(response.data);
        console.log(response.data,"responsee")
      })
      .catch((error) => {
        console.log(error, "rejects")
        reject(error)
        

      });
  });
};

module.exports = { imperialApiAxios };
