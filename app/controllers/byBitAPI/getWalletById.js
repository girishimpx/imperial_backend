const { handleError } = require('../../middleware/utils');
const WALLET = require('../../models/wallet');
const cpy = require('../../models/copytrade');
const { RestClientV5 } = require('bybit-api');



const getWalletById = async (req, res) => {
    try {

        const ID = req.user._id
        // console.log(ID,'*******************');
        // const wallets = await WALLET.find({ user_id: ID }).sort({balance : -1})
        const wallets = await WALLET.aggregate([
            { $match: { user_id: ID } },
            {
              $addFields: {
                nonZero: { $cond: { if: { $ne: ["$balance", 0] }, then: 1, else: 0 } }
              }
            },
            { $sort: { nonZero: -1, balance: -1 } },
            { $project: { nonZero: 0 } }
          ]);
        const keyData = await cpy.findOne({ user_id: ID })

        const client = new RestClientV5({
            testnet: false,
            key: keyData.apikey,
            secret: keyData.secretkey,
        });

        const balance = await client.getWalletBalance({
            accountType: 'UNIFIED'
            //  coin: 'BTC',
        })
        // console.log(balance, 'balance SDK');

        if (wallets.length > 0) {
            res.status(200).json({
                success: true,
                result: wallets,
                total_price_in_usd: Number(balance.result.list[0].totalEquity) || 0,
                message: 'Wallets found successfully'
            })
        } else {
            res.status(200).json({
                success: false,
                result: [],
                message: 'Wallets Not found'
            })
        }

    } catch (error) {
        handleError(res, error)
    }
};
module.exports = { getWalletById };
