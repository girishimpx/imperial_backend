const { handleError } = require('../../middleware/utils');
const Trade = require("../../models/trade");
const cpy = require('../../models/copytrade');
const { RestClientV5 } = require('bybit-api');
const mongoose = require('mongoose')


const getTradeDetails = async (req, res) => {
    try {
        // const client = new RestClientV5({
        //     key: '0l0RFNXVkw0F0YfhDY',
        //     secret: 'vqw7hgSgKaB8sLPFal42zDj5cU9JQQsAx4Ei',
        //     demoTrading: false
        // });

        const allTrades = await Trade.find({ status: 'init' })
        // console.log(allTrades, 'allTrades');

        if (allTrades.length > 0) {
            // console.log('alltrades > 0');
            for (var i = 0; i < allTrades.length; i++) {

                // console.log(`looping${i}`);
                try {
                    const user = await cpy.findOne({ user_id: allTrades[i].user_id })
                    // console.log(user, 'userid');

                    const apiKey = user.apikey
                    const secret = user.secretkey

                    // console.log(apiKey, secret, 'userid');
                    const client = new RestClientV5({
                        key: apiKey,
                        secret: secret,
                        demoTrading: false
                    });
                    // console.log(client, 'client');
                    const tradeHistory = await client.getHistoricOrders({
                        category: allTrades[i].trade_at == 'future' ? 'linear' : 'spot',
                        orderId: allTrades[i].order_id,
                    })
                    // console.log(tradeHistory.result.list, 'trswfrwer');

                    if (tradeHistory?.result?.list?.length > 0) {
                        // console.log('Tradehistorylist',tradeHistory.result.list[0]);
                        const tradeData = {
                            status: tradeHistory.result.list[0].orderStatus,
                            tradeId: tradeHistory.result.list[0].orderLinkId,
                            // price: tradeHistory.result.list[0].price != 0 ? tradeHistory.result.list[0].price : allTrades[i].price,
                            price: tradeHistory.result.list[0].price != 0 ? tradeHistory.result.list[0].price : tradeHistory.result.list[0].avgPrice,
                            volume: tradeHistory.result.list[0].qty
                        }

                        await Trade.findOneAndUpdate({ _id: allTrades[i]._id }, tradeData)
                        console.log('success')
                    } else {
                        // console.log(tradeHistory,'TD HIS',allTrades[i].order_id);
                        // console.log('Trade details not available');
                    }

                } catch (error) {
                    console.log(error, 'Error')
                }


            }

        } else {
            console.log('All Trades Are Filled');
        }

    } catch (error) {
        handleError(res, error)
    }
};
module.exports = { getTradeDetails };
