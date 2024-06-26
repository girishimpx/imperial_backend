const { RestClientV5 } = require('bybit-api');


const getLivePrice = (coin) => {

    return new Promise((resolve, reject) => {
        const client = new RestClientV5({
            testnet: true,
        });

        client
            .getTickers({
                category: 'spot',
                symbol: `${coin + "USDT"}`,
            })
            .then((response) => {
                if (response) {
                    resolve(response.result.list[0].usdIndexPrice)
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

module.exports = { getLivePrice };
