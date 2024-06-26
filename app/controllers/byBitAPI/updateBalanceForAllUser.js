const { handleError } = require("../../middleware/utils");
const CPY = require('../../models/copytrade')
const WALLET = require('../../models/wallet')
const axios = require("axios");
const CryptoJS = require("crypto-js");

const updateBalanceForAllUser = async (req, res) => {

    try {

    const subaccount = await CPY.find();

    if(subaccount.length > 0){

        for(var i = 0; i < subaccount.length; i++){

        const endpoint = 'https://api.bybit.com/v5/account/wallet-balance?accountType=UNIFIED';
        const apiKey = subaccount[i].apikey                     //'0l0RFNXVkw0F0YfhDY';
        const apiSecret = subaccount[i].secretkey                 //'vqw7hgSgKaB8sLPFal42zDj5cU9JQQsAx4Ei';
        const recvWindow = 50000
        
        const urlObject = new URL(endpoint);
        const searchParams = urlObject.searchParams;

        const timestamp = Date.now();
        const queryString = timestamp + subaccount[i].apikey + recvWindow + searchParams
        const signature = CryptoJS.HmacSHA256(queryString, subaccount[i].secretkey).toString(CryptoJS.enc.Hex);

        const headers = {
            "Host": "api.bybit.com",
            "X-BAPI-SIGN" : signature,
            "X-BAPI-API-KEY" : subaccount[i].apikey,
            "X-BAPI-TIMESTAMP" : timestamp,
            "X-BAPI-RECV-WINDOW" : recvWindow,
            "Content-Type": 'application/json',
        };  

        try {
            
            const response = await axios.get(endpoint, { headers });
            // console.log('API Response:', response.data);
    
            if (response.data.retCode === 0) {
               
              const allBalance = response.data.result.list[0].coin
    
              if(allBalance.length > 0){
                
                for(var ii = 0; ii < allBalance.length; ii++) {
    
                    const newData = {
                        balance : allBalance[ii].walletBalance,
                        escrow_balance : allBalance[ii].locked,
                        usdValue : allBalance[ii].usdValue,
                        margin_loan : allBalance[ii].borrowAmount
                    }
    
                   await WALLET.findOneAndUpdate({ user_id : subaccount[i].user_id , coinname : allBalance[ii].coin },newData)
    
                }
    
              }
    
              } else {
                console.log(response.data.retMsg,'error')
              }

        } catch (error) {
            console.log(error,'errs');
        }

    }

    } else {
        console.log('No Sub-Account Found');
    }
   
        

    } catch (error) {
        console.log(error,'err');
    }
}

module.exports = { updateBalanceForAllUser };
