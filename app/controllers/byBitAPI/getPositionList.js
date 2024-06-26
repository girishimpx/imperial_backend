const { handleError } = require("../../middleware/utils");
const SUB = require("../../models/subaccount");
const { RestClientV5 } = require('bybit-api');

const getPositionList = async (req, res) => {
    
    try {

        const client = new RestClientV5({
            testnet: false,
            key: 'jHlgwulzoxB7rbtDog',
            secret: 'x4o1P0Qw50i0pCkczObCJkHtZQ7gUsA51GaS',
          });

        const positionList = await client.getPositionInfo({
            category: 'linear',
            // symbol: `${req.body.pair}`,
            settleCoin: 'USDT'
        })

        console.log(positionList,'positionList');

        if(positionList.retCode == 0){

            res.status(200).json({
                success: true,
                result: positionList.result.list,
                message:'Positions Found SuccessFully',
            });

        } else {

            res.status(200).json({
                success: false,
                result: [],
                message: positionList.retMsg,
            });

        }

           
        

    } catch (error) {
        handleError(res, error);
    }
};

module.exports = { getPositionList };
