const { RestClientV5 } = require('bybit-api');

const getOrderDetails = async (req, res) => {

    const client = new RestClientV5({
        testnet: false,
        key: 'jHlgwulzoxB7rbtDog',
        secret: 'x4o1P0Qw50i0pCkczObCJkHtZQ7gUsA51GaS',
    });

    client
        .getHistoricOrders({
            category: 'spot',
            orderId: "1715357516092932609",
            // symbol:"EOSUSDT"
        })
        .then((response) => {
            console.log(response);
            res.status(200).json({
                result: response
            })
        })
        .catch((error) => {
            res.status(201).json({
                result: error
            })
            console.error(error);
        });
}

module.exports = { getOrderDetails }