const { matchedData } = require('express-validator')
const { handleError } = require('../../middleware/utils')
const {
    emailExists,
    sendRegistrationEmailMessage
} = require('../../middleware/emailer')
const axios = require('axios')
const asseticon = require('../../models/assetIcon')
const { imperialApiAxios } = require('../../middleware/ImperialApi/imperialApi')
const tickers = require('../../models/allTickers')

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createasseticon = async (req, res) => {
    try {
        const response = await imperialApiAxios(
            "get",
            "https://www.imperialx.exchange/api/v5/asset/currencies",
            `/api/v5/asset/currencies`,
            {},
            "622e4d02-dd52-428e-a8bf-357836b96628",
            "458015C86ECB5D0250389BB0DD299722",
            "Test@1530",
        )
        let initialarr = []
        let array = []
        const pre = await tickers.aggregate([
            { $unwind: '$data' }
        ])
        for (i = 0; i < response.data.length; i++) {
            if (array.includes(response.data[i].ccy)) {

            } else {
                array.push(response.data[i].ccy)
                for (let j = 0; j < pre.length; j++) {
                    if (pre[j].data.instId.split('-')[0] === response.data[i].ccy) {
                        pre[j].data.image = response.data[i].logoLink
                        delete pre[j]._id
                        delete pre[j].createdAt
                        delete pre[j].updatedAt
                        console.log(pre[j], "j")
                        initialarr?.push(pre[j].data)
                    }
                }
                // await asseticon.create({ ccy: response.data[i].ccy, image: response.data[i].logoLink })
            }
        }
        if (initialarr.length > 0) {
            const log = await tickers.create({ data: initialarr })
            res.status(200).json({
                success: true,
                data: log,
                message: "Asset icon created successfully"
            })

        }


    } catch (error) {
        handleError(res, error)
    }
}

module.exports = { createasseticon }