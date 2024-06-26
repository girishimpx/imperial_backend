const { handleError } = require('../../middleware/utils');
const CopyTrade = require('../../models/copytrade');
const Trade = require('../../models/trade');
const { RestClientV5 } = require('bybit-api');


const closePosition = async (req, res) => {
    try {

    const user = req.user;

    const getUser = await CopyTrade.findOne({ user_id : user._id });

    const client = new RestClientV5({
    testnet: false,
    key: getUser.apikey,
    secret: getUser.secretkey,
    });

    const params = {
        category : req.body.category,
        symbol : req.body.symbol,
        side : req.body.side,
        orderType : req.body.orderType,
        qty : `${req.body.qty}`,
        price : req.body.price ? `${req.body.price}` : '1',
        timeInForce : 'GTC',
        positionIdx : 0,
        // orderLinkId : '', (OPTIONAL FOR FUTURE ORDER) so ommited
        reduceOnly : true
    };

    console.log(req,'request');
    console.log(params,'close position params');

    const positionOrder = await client.submitOrder(params);

        
    if (positionOrder.retCode == 0){


        const positiondata = {
            user_id: user._id,
            loan_user_id: user._id,
            trade_type: req.body.side.toLowerCase(),
            ouid: "ouid",
            symbol: req.body.symbol,
            order_id: positionOrder.result.orderId,
            pair: req.body.symbol,
            order_type: req.body.orderType,
            volume: Number(req.body.qty),
            leverage: req.body.lever || 0,
            trade_at: 'future',
            entry_price: req.body.px,
            trade_in: "bybit",
            tpPrice: req.body.tpPrice ? req.body.tpPrice : '--',
            slPrice: req.body.slPrice ? req.body.slPrice : '--',
            istpslclose : true,
            status : 'init'
        }

        await Trade.create(positiondata)

            res.status(200).json({
                success: true,
                result: positionOrder,
                message: `Position Closed Successfully In ${req.body.orderType} Order`,
            });

    } else {
            res.status(200).json({
                success: false,
                result: '',
                message: positionOrder.retMsg,
            });
    }



    } catch (error) {
        handleError(res, error)
    }
};
module.exports = { closePosition };
