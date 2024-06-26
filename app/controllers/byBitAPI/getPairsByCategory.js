const { handleError } = require('../../middleware/utils');
const CopyTrade = require('../../models/copytrade');
const pairlist = require('../../models/newPairs');
const { RestClientV5 } = require('bybit-api');


const getPairsByCategory = async (req, res) => {
    try {
        const { category, coin } = req.body;

const client = new RestClientV5({
    testnet: false,
    key: '0l0RFNXVkw0F0YfhDY',
    secret: 'vqw7hgSgKaB8sLPFal42zDj5cU9JQQsAx4Ei',
},); 


const tradePair = await client.getInstrumentsInfo({
    category: category,
    symbol: coin,
})

if(tradePair.retCode == '0'){
    
    for(var i = 0; i < tradePair.result.list.length; i++){

        var element = tradePair.result.list[i];

        var addPair = {
            category : category,
            symbol : element.symbol,
            baseCoin : element.baseCoin,
            quoteCoin : element.quoteCoin,
            status : element.status,
            // marginTrading : element.marginTrading,
            imageurl : `https://www.bybit.com/bycsi-root/assets/image/coins/light/${element.baseCoin.toLowerCase()}.svg`,
        }

        await pairlist.create(addPair);

    }

    res.status(200).json({
        success: true,
        result: tradePair,
        message: "Pairs added SuccessFully",
    });

}else{
    res.status(200).json({
        success: false,
        result: tradePair.retMsg,
        message: "Data Not Found",
    });

}

    } catch (error) {
        handleError(res, error)
    }
};
module.exports = { getPairsByCategory };
