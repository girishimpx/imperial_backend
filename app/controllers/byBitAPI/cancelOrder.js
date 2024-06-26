const { handleError } = require('../../middleware/utils');
const CopyTrade = require('../../models/copytrade');
const { RestClientV5 } = require('bybit-api');


const cancelOrder = async (req, res) => {
    try {
        const user = req.user
console.log(user,"user")

const getUser = await CopyTrade.findOne({user_id:user._id})
console.log(getUser,"getapi")

const client = new RestClientV5({
  testnet: false,
  key: getUser.apikey,
  secret: getUser.secretkey,
});

// const client = new RestClientV5({
//     key: 'AZIEKWTVtGs92FG9a5',
//     secret: 'KTYja4QaeU85Q58iz01arRZl7b6vv0ufND7W',
//     demoTrading: true
// },); 


const cancelorder = await client.cancelOrder({
        category: req.body.category ? req.body.category : 'spot',
        symbol: req.body.symbol,
        orderId: req.body.orderId,
    })

if(cancelorder){
    if(cancelorder.retCode == 0){
        res.status(200).json({
            success: true,
            result:cancelorder.result,
            message: "Order Closed Successfully",
        });

    }else{
        res.status(200).json({
            success: false,
            result: '',
            message: cancelorder.retMsg,
        });

    }

}else{
    res.status(200).json({
        success: false,
        result:'',
        message: "Data Not Found",
    });

}

    } catch (error) {
        handleError(res, error)
    }
};
module.exports = { cancelOrder };
