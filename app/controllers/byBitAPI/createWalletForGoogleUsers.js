const generator = require('generate-password');
const ASSETS = require('../../models/assets');
const Wallet = require('../../models/wallet');
const { RestClientV5 } = require('bybit-api');
const subaccount = require("../../models/subaccount");



const createWalletForGoogleUsers = async (id,name) => {
    try {

        const assetList = await ASSETS.find();
        const useid = id;
        const subName = name;
        const wallets = await Wallet.find({ user_id: useid })

        let unique = generator.generate({
            length: 16,
            numbers: true,
            uppercase: true,
        })

        const client = new RestClientV5({
            testnet: false,
            key: '0l0RFNXVkw0F0YfhDY',
            secret: 'vqw7hgSgKaB8sLPFal42zDj5cU9JQQsAx4Ei',
          });

        if (wallets.length > 0) {
           console.log('User Already Have Wallet');
        }
        else {
            if (assetList.length > 0) {

                const isSubExist = await subaccount.findOne({ user_id : id})
                console.log(isSubExist);
                if(isSubExist){
                    console.log('SUbAccount Already Created');
                } else {
                    console.log('else');
                const subAccount = await client.createSubMember({
                    username: unique,
                    memberType: 1,
                    switch: 1,
                    isUta: true,
                    note: subName,
                })
                console.log(subAccount,'subAccount');
                if(subAccount.retCode == 0){
                    const subApi = await client.createSubUIDAPIKey({
                        subuid : subAccount.result.uid,
                        note : subName,
                        readOnly : 0,  
                        ips : "134.209.100.33,49.37.201.206",
                        permissions : {
                            ContractTrade : ["Order","Position"],
                            Spot : ["SpotTrade"],
                            Wallet: ["AccountTransfer"],
                            Options : ["OptionsTrade"],
                            Exchange : ["ExchangeHistory"],
                            CopyTrading : ["CopyTrading"]
                        }
                      })
                      console.log(subApi,'subApi');
                      if(subApi.retCode == 0){
                        for (var i = 0; i < assetList.length; i++) {
                            const payload = await Wallet.create({
                                coinname: assetList[i].coinname,
                                asset_id: assetList[i]._id,
                                balance: 0,
                                escrow_balance: 0,
                                symbol: assetList[i].symbol,
                                user_id: id,
                                url : `https://www.bybit.com/bycsi-root/assets/image/coins/light/${assetList[i].coinname.toLowerCase()}.svg`,
                            });
                        }
                        console.log('Assets Created Successfully');
                      }
                }

            }

               

            } else {
               console.log('No assets found');
            }
        }


    } catch (error) {
       console.log(error,'error');
    }
};
module.exports = { createWalletForGoogleUsers };
