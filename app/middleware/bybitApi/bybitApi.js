const axios = require("axios");
const CryptoJS = require("crypto-js");
const { handleError } = require("../../middleware/utils");

const bybitApi = async (METHOD, url, data, apiKey, secretKey) => {

  const method = METHOD.toUpperCase();
  
  if(method == "POST"){

    try {

      const endpoint = url;
      const apiKey = apiKey != '' ? apiKey : '0l0RFNXVkw0F0YfhDY';
      const apiSecret = secretKey != '' ? secretKey : 'vqw7hgSgKaB8sLPFal42zDj5cU9JQQsAx4Ei';
      const recvWindow = 50000
  
      const timestamp = new Date().getTime() + 1000;
      const queryString = timestamp + apiKey + recvWindow + data != '' ? data : ''
      const signature = CryptoJS.HmacSHA256(queryString, apiSecret).toString(CryptoJS.enc.Hex);
      
      const headers = {
          "Host": "api.bybit.com",
          "X-BAPI-SIGN" : signature,
          "X-BAPI-API-KEY" : apiKey,
          "X-BAPI-TIMESTAMP" : timestamp,
          "X-BAPI-RECV-WINDOW" : recvWindow,
        'Content-Type': 'application/json',
      };

      let axiosConfig = { headers };

    if(data){
      axiosConfig.data = data;
    }
      
      axios.get (endpoint, axiosConfig)
        .then(async (response) => {

          if(response.data.retCode == 0){
             
              var assertData = response.data.result.rows
              for(var i = 0; i < assertData.length; i++){
                  var assets = {
                      coinname : assertData[i].name,
                      chain : assertData[i].chains[0].chainType,
                      symbol : assertData[i].chains[0].chain,
                  }

                  await ASSETS.create(assets)
              }

               res.status(200).json({
                   success : true,
                   data : response.data.result.rows, 
                   message : "Assets Added SuccessFully"
                  })

          }else{
              res.status(200).json({
                  success : false,
                  data : [], 
                  message : response.data.retMsg,
                  })
          }
        })
        .catch(error => {
          console.error('Error:', error.message);
        });
      

  } catch (error) {
      handleError(res, error);
  }

  } else if (method == "GET") {

    try {

        const userID = req.user; 
        const allAssets = await ASSETS.find();
        const userUid = await SUB.findOne({user_id : userID._id});
        const apiKey = '0l0RFNXVkw0F0YfhDY';
        const apiSecret = 'vqw7hgSgKaB8sLPFal42zDj5cU9JQQsAx4Ei';
        const recvWindow = 50000;
        let check = 0;

        for (let i = 0; i < allAssets.length; i++) {

            const endpoint = url;

            const timestamp = new Date().getTime() + 1000;

            const urlObject = new URL(endpoint);
            const searchParams = urlObject.searchParams;

            const queryString = timestamp + apiKey + recvWindow + searchParams
            const signature = CryptoJS.HmacSHA256(queryString, apiSecret).toString(CryptoJS.enc.Hex);

            const headers = {
                "Host": "api.bybit.com",
                "X-BAPI-SIGN": signature,
                "X-BAPI-API-KEY": apiKey,
                "X-BAPI-TIMESTAMP": timestamp,
                "X-BAPI-RECV-WINDOW": recvWindow,
                'Content-Type': 'application/json',
            };

            // console.log(endpoint,'endpoint');
            // console.log(searchParams,'searchParams');
            // console.log(headers,'headers');

            try {
                const response = await axios.get(endpoint, { headers });
                console.log('API Response:', response.data);

                if (response.data.retCode === 0) {
                  res.status(200).json({
                    success: true,
                    data: response.data,
                    message : response.data.retMsg
                  })
                } else {
                  res.status(200).json({
                    success: false,
                    data: [],
                    message : response.data.retMsg
                  })
                }


            } catch (error) {
                console.error('Error:', error.message);
            }

        }

    } catch (error) {
        handleError(res, error);
    }

module.exports = { createDepositAddress };


  } else {
    throw new Error("Method not allowed");
  }
  
  

};

module.exports = { bybitApi };
