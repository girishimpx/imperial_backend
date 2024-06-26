const { handleError } = require("../../middleware/utils");
const mongoose = require("mongoose");
const subaccount = require("../../models/subaccount");
const subkey = require('../../models/copytrade')
const axios = require("axios");
const generator = require('generate-password');
const { RestClientV5 } = require('bybit-api');

const balance = async (req, res) => {

    try {

        const client = new RestClientV5({
            key: 'AZIEKWTVtGs92FG9a5',
            secret: 'KTYja4QaeU85Q58iz01arRZl7b6vv0ufND7W',
            demoTrading: true
        },);

        const data = await client.getWalletBalance({
            accountType: 'UNIFIED',
            // coin: 'BTC',
        })

        if (data.retCode == 0) {
            res.status(200).json({
                success: true,
                result: data.result.list,
                message: "wallet Balance"
            })
        } else {
            res.status(200).json({
                success: false,
                result: "",
                message: data.retMsg
            })
        }



    } catch (error) {
        handleError(res, error);
    }
}

module.exports = { balance };
