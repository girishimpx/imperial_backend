const { handleError } = require('../../middleware/utils');
const CopyTrade = require('../../models/copytrade');
const { RestClientV5 } = require('bybit-api');


const getTradeBalance = async (req, res) => {
    try {

    const user = req.user;
    const pair = req.body.pair.toUpperCase();

    const getUser = await CopyTrade.findOne({user_id:user._id});

    const client = new RestClientV5({
    testnet: false,
    key: getUser.apikey,
    secret: getUser.secretkey,
    });


    const activeorder = await client.getWalletBalance   ({accountType: 'UNIFIED', coin: pair})

        console.log(activeorder.result.list[0].coin,'walet api response')
    if (activeorder.retCode == 0){
            res.status(200).json({
                success: true,
                result: activeorder,
                message: "Trade Balance Found Successfully",
            });

    } else {
            res.status(200).json({
                success: false,
                result: '',
                message: activeorder.retMsg,
            });
    }



    } catch (error) {
        handleError(res, error)
    }
};
module.exports = { getTradeBalance };
