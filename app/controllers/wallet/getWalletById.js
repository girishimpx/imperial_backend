const { getItemById } = require('../../middleware/db')
const wallet = require('../../models/wallet')
const asset = require('../../models/assets')
const { handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const getBalance = require('./getBalanceUsdt')
const USER = require('../../models/user')
const cpytrades = require('../../models/copytrade')
const { assetBills } = require("./helpers/assetBills");
const { imperialApiAxios } = require('../../middleware/ImperialApi/imperialApi')


const getWalletById = async (req, res) => {
    try {
        const user = req.user
        req = matchedData(req)
        const balance = []
        let total_price_in_usd = 0
        const data = await wallet.find({ user_id: user._id }).populate("asset_id").sort({ balance: -1 })
        for (j = 0; j < data.length; j++) {

            let usdtBalance = getBalance.getBalanceUsdt(data[j].symbol, data[j].balance)
            total_price_in_usd = total_price_in_usd + usdtBalance
            let chain_balance = {
                symbol: data[j].symbol,
                bal: data[j].balance,
                usdtBalance: usdtBalance
            }
            balance.push(chain_balance)

        }

        const essesentials = await cpytrades.findOne({user_id : user._id})
        console.log(essesentials,'essesentials');

        // apikey
        // secretkey
        // passphrase

        // /api/v5/account/balance?ccy=USDT

        const USDTBAL = await imperialApiAxios(
            "get",
            "https://www.okx.com/api/v5/account/balance",
            `/api/v5/account/balance`,
            {},
            essesentials.apikey,
            essesentials.secretkey,
            essesentials.passphrase,
        );

        // console.log(USDTBAL.data[0].totalEq,'CHAIN');
        total_price_in_usd = Number(USDTBAL.data[0].totalEq)
        console.log(total_price_in_usd,'*******************');

        const eligiblecheck = await USER.findById(user._id)

        if(eligiblecheck.iseligible == 'null'){

            const firstDeposit =  await assetBills(user._id);
            console.log(firstDeposit,'NULL *******************');
            if(firstDeposit != 'null' && firstDeposit.length > 0){

            if(firstDeposit[0].balChg >= 50 ){

            const copyMaster = await cpytrades.findOne({user_id : user._id})
            if(copyMaster.follower_user_id.length > 0){
    
            const updateReedeme = {
                iseligible : 'completed',
                referaldeposit : 'eligible'
            }

            const trader = await USER.findByIdAndUpdate({_id : user._id},updateReedeme)
                
            console.log(firstDeposit[0].balChg,'******************* FIRSTDEPOSIT AMOUNT'); 
            
        }
        }else{
            const trader = await USER.findByIdAndUpdate({_id : user._id},{iseligible: 'not_eligible', referaldeposit : 'not_eligible'})
        }

        
        }
    }

        if (data.length > 0) {
            res.status(200).json({
                success: true,
                result: data, total_price_in_usd,
                message: 'Data found succesfully'
            })

        } else {
            res.status(400).json({
                success: false,
                result: null,
                message: 'Data not found'
            })

        }

    } catch (error) {
        handleError(res, error)
    }
};
module.exports = { getWalletById };
