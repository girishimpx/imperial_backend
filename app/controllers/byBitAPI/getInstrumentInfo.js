const { handleError } = require('../../middleware/utils');
const { matchedData } = require("express-validator");
const { RestClientV5 } = require('bybit-api');
const axios = require('axios');


const client = new RestClientV5({
    testnet: false
  });


const getInstrumentInfo = async (req, res) => {
 
    try {
        
        req = matchedData(req);

        const info = await client.getInstrumentsInfo({
            category : req.type,
            symbol : req.pair
        })

        
        if(info.retCode == 0){

            res.status(200).json({
                success: true,
                result: info.result.list,
                message: "Instrument Data Found Successfully",
            });

        } else {

            res.status(200).json({
                success: false,
                result: [],
                message: info.retMsg,
            });

        }

    } catch (error) {
        handleError(res, error)
    }

};
module.exports = { getInstrumentInfo };
