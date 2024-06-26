const { RestClientV5 } = require('bybit-api');


const getLinearLivePrice = (coin) => {

    return new Promise((resolve, reject) => {
        const client = new RestClientV5({
            testnet: true,
        });

        client
            .getTickers({
                category: 'linear',
                symbol: coin,
            })
            .then((response) => {
                console.log(response.result.list, 'liveprice');
                if (response) {
                    resolve(response.result.list[0].markPrice)
                }
                // console.log(response);
                // console.log(response.result.list[0]);
                // console.log(response.result.list[0].usdIndexPrice)
            })
            .catch((error) => {
                console.error(error);
            });
    })
};

module.exports = { getLinearLivePrice };
