const { handleError } = require('../../middleware/utils');
const { matchedData } = require("express-validator");
const { RestClientV5 } = require('bybit-api');
const axios = require('axios');





const modifySubApi = async (req, res) => {




    try {

        const ip = req.body.ip
        console.log(ip, 'ENTERED');

        const client = new RestClientV5({
            testnet: false,
            key: `${req.body.key}`,
            secret: `${req.body.secret}`,
        });

        const info = await client.updateSubApiKey({
            ips: [`134.209.100.33,${ip}`]
        })
        // console.log(info, ' info.result.list');

        if (info.retCode == 0) {

            res.status(200).json({
                success: true,
                result: info.result.list,
                message: `IP ${ip} Added Successfully`,
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
module.exports = { modifySubApi };
