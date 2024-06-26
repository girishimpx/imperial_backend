const { handleError } = require('../../middleware/utils');
const ASSETS = require('../../models/assets');
const Wallet = require('../../models/wallet');


const createWallet = async (req, res) => {
    try {

        const assetList = await ASSETS.find();
        // console.log(assetList, 'assetList');
        const Id = req.user.id;
        // console.log(Id, 'Id');
        const wallets = await Wallet.find({ user_id: Id })
        // console.log(wallets, 'wallets');

        if (wallets.length > 0) {
            res.status(201).json({
                success: false,
                message: "Wallet Already Created",
                result: ''
            })
        }
        else {
            if (assetList.length > 0) {

                for (var i = 0; i < assetList.length; i++) {
                    const payload = await Wallet.create({
                        coinname: assetList[i].coinname,
                        asset_id: assetList[i]._id,
                        balance: 0,
                        escrow_balance: 0,
                        symbol: assetList[i].symbol,
                        user_id: Id,
                        url : `https://www.bybit.com/bycsi-root/assets/image/coins/light/${assetList[i].coinname.toLowerCase()}.svg`,
                    });
                }

                res.status(200).json({
                    success: true,
                    result: [],
                    message: "Wallet Created SuccessFully"
                })

            } else {
                res.status(200).json({
                    success: false,
                    result: [],
                    message: "No Asset Found"
                })
            }
        }


    } catch (error) {
        handleError(res, error)
    }
};
module.exports = { createWallet };
