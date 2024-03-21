const { matchedData } = require('express-validator')
const { handleError } = require('../../middleware/utils')

const CryptoJS = require('crypto-js')
const axios = require('axios')
const microtime = require('microtime')

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const checkapi = async (req, res) => {
    try {
        const timestamp = Date.now()
        const sign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp + 'GET' + '/api/v5/copytrading/current-subpositions', process.env.OKXSECRET))
        // const data = await axios.get('https://www.okx.com/api/v5/copytrading/current-subpositions', {
        //     headers: {
        //         "OK-ACCESS-KEY": "55d7486d-3cfb-4883-bdf6-c6f7534b10a2",
        //         "OK-ACCESS-SIGN": sign,
        //         "OK-ACCESS-PASSPHRASE": "Vijay@123",
        //         "OK-ACCESS-TIMESTAMP": timestamp
        //     }
        // })


        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://www.okx.com/api/v5/copytrading/current-subpositions',
            headers: {
                "OK-ACCESS-KEY": "55d7486d-3cfb-4883-bdf6-c6f7534b10a2",
                "OK-ACCESS-SIGN": sign,
                "OK-ACCESS-PASSPHRASE": "Vijay@123",
                "OK-ACCESS-TIMESTAMP": timestamp
                // 'Cookie': '__cf_bm=P9RqdBbKxLHrOxKOf00enwLv0iZyIKHzJ4IfAODMs0s-1686135826-0-AZzKIljgNe3SPhkrfvSHRkaNFJfQwo2iGsMXOQ6tp8hfVy72TyKRuBce3DLrkA+5eZtUV0YQfhmwPOpvVlxBEPI=; locale=en_US'
            }
        };

        axios.request(config)
            .then((response) => {
                const data = JSON.stringify(response.data)
                res.status(200).json({
                    success: true,
                    result: { sign, timestamp, data },
                    message: "2FA Successfully Disabled"
                })
            })
            .catch((error) => {
                console.log(error);
            });
        // res.status(200).json({
        //     success: true,
        //     result: { sign, timestamp, data },
        //     message: "2FA Successfully Disabled"
        // })

    } catch (error) {
        handleError(res, error)
    }
}

module.exports = { checkapi }
