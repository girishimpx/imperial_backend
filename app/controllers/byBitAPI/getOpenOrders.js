const { handleError } = require('../../middleware/utils');
const CopyTrade = require('../../models/copytrade');
const { RestClientV5 } = require('bybit-api');


const getOpenOrders = async (req, res) => {
    try {
        const user = req.user
console.log(user,"user")

const getUser = await CopyTrade.findOne({user_id:user._id})
console.log(getUser,"getapi",getUser.apikey)

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


const activeorder = await client.getActiveOrders({
    category: req.body.category,
    symbol: req.body.pair,
    openOnly: 0
    // limit: 1,
})
console.log(activeorder,"activeorder")
if(activeorder){
    if(activeorder.retCode == 0){
        res.status(200).json({
            success: true,
            result: activeorder.result.list,
            message: "OpenOrder Found Successfully",
        });

    }else{
        res.status(200).json({
            success: false,
            result: '',
            message: activeorder.retMsg,
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
module.exports = { getOpenOrders };
