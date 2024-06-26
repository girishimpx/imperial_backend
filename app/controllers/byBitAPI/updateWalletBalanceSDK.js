const CPY = require('../../models/copytrade')
const WALLET = require('../../models/wallet')
const { RestClientV5 } = require('bybit-api');



const updateWalletBalanceSDK = async (req, res) => {

   try {
    
    const subaccount = await CPY.find();
    console.log(subaccount.length,'length')
    if(subaccount.length > 0){

        for(var i = 0; i < subaccount.length; i++){
          console.log(`running${i}times`);
            const client = new RestClientV5({
                testnet: false,
                key: subaccount[i].apikey,
                secret: subaccount[i].secretkey,
              });

              try {
                
                if (resuu.retCode === 0) {
                  console.log(resuu.result.list[0].coin,'listiiii');
                    const allBalance = resuu.result.list[0].coin
  
                    if(allBalance.length > 0){
  
                      for(var ii = 0; ii < allBalance.length; ii++){
  
                        const newData = {
                          balance : allBalance[ii].walletBalance,
                          escrow_balance : allBalance[ii].locked,
                          usdValue : allBalance[ii].usdValue,
                          margin_loan : allBalance[ii].borrowAmount
                      }
  
                        // await WALLET.findOneAndUpdate({ user_id : mongoose.Types.ObjectId(subaccount[i].user_id) , coinname : allBalance[ii].coin }, { Entry_bal : allBalance[ii].walletBalance })
  
                      }
  
                    }
  
                 } else {
                  console.log(resuu.message,'Error');
                 }

              } catch (error) {
                console.log(error?.message ? error.message : error)
              }

              const resuu = await client.getWalletBalance({
                accountType: 'UNIFIED',
                // coin: 'BTC',
              })

              console.log(resuu,'resuu');
             

        }

    } else {
        console.log('No Sub-Account Found');
    }


   } catch (error) {
      console.log(error,'error');
   }

}

module.exports = { updateWalletBalanceSDK };