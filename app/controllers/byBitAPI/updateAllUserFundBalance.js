const { handleError } = require("../../middleware/utils");
const SUNACC = require('../../models/subaccount')
const WALLET = require('../../models/wallet')
const axios = require("axios");
const CryptoJS = require("crypto-js");
const  mongoose  = require("mongoose");


const updateAllUserFundBalance = async (req, res) => {
    // console.log('Fundbalance');

    try {

      const subaccount = await SUNACC.find();
  
      if(subaccount.length > 0){
  
          for(var i = 0; i < subaccount.length; i++){
  
          const endpoint = `https://api.bybit.com/v5/asset/transfer/query-account-coins-balance?memberId=${subaccount[i].uid}&accountType=FUND`;
          const apiKey = '0l0RFNXVkw0F0YfhDY';
          const apiSecret = 'vqw7hgSgKaB8sLPFal42zDj5cU9JQQsAx4Ei';
          const recvWindow = 50000
          
          const urlObject = new URL(endpoint);
          const searchParams = urlObject.searchParams;
  
          const timestamp = Date.now();
          const queryString = timestamp + apiKey + recvWindow + searchParams
          const signature = CryptoJS.HmacSHA256(queryString, apiSecret).toString(CryptoJS.enc.Hex);
  
          const headers = {
              "Host": "api.bybit.com",
              "X-BAPI-SIGN" : signature,
              "X-BAPI-API-KEY" : apiKey,
              "X-BAPI-TIMESTAMP" : timestamp,
              "X-BAPI-RECV-WINDOW" : recvWindow,
              "Content-Type": 'application/json',
          };  
          try {
            
            const response = await axios.get(endpoint, { headers });
            // console.log('API Response:', response.data);
    
            if (response.data.retCode === 0) {
               
              const allBalance = response.data.result.balance
    
              if(allBalance.length > 0){
                
                for(var ii = 0; ii < allBalance.length; ii++) {
    
                   await WALLET.findOneAndUpdate({ user_id : mongoose.Types.ObjectId(subaccount[i].user_id) , coinname : allBalance[ii].coin },{ Entry_bal : allBalance[ii].walletBalance })
    
                }
    
              }
    
              } else {
                console.log(response.data.retMsg,'error');
              }

          } catch (error) {
            console.log(error,'Error');
          }
  
      }
  
      } else {
          console.log('No Sub-Account Found');
      }
     
          
  
      } catch (error) {
          console.log(error,'err');
      }

}

module.exports = { updateAllUserFundBalance };
