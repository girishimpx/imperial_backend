const { matchedData } = require("express-validator");
const User = require("../../models/user");
const trade = require("../../models/trade");
const { handleError } = require("../../middleware/utils");
const { isIDGood } = require("../../middleware/utils/isIDGood");
const { imperialApiAxios } = require('../../middleware/ImperialApi/imperialApi')

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const getUserTradingHistory = async (req, res) => {
    try {
        const user = req.user;
        req = matchedData(req)
        console.log(req, "asdf")
        if (req.instType === undefined) {
            res.status(400).json({
                success: false,
                result: null,
                message: "Please Enter TYPE",
            });
        } else {
            var url = `https://www.imperialx.exchange/api/v5/trade/orders-history-archive?`
            var halfurl = `/api/v5/trade/orders-history-archive?`;
            const data = {}
            if (req.instType) {
                var url = url + `instType=${req.instType}`
                var halfurl = halfurl + `instType=${req.instType}`
            }
            if (req.instId) {
                var url = url + `&instId=${req.instId}`
                var halfurl = halfurl + `&instId=${req.instId}`
            }
            if (req.ordType) {
                var url = url + `&ordType=${req.ordType}`
                var halfurl = halfurl + `&ordType=${req.ordType}`
            }
            if (req.state) {
                var url = url + `&state=${req.state}`
                var halfurl = halfurl + `&state=${req.state}`
            }
            console.log(url, "urls")
            const response = await imperialApiAxios("get", url, halfurl, {}, '93975967-ed47-4070-a436-329e22e14a1b', 'CBB7D9C9B6426A6562D2741A1E8AC9A6')
            if (response.data.length > 0) {
                res.status(200).json({
                    success: true,
                    result: response.data,
                    message: "Fetch Successfully",
                });
            } else {
                res.status(400).json({
                    success: false,
                    result: response.data,
                    message: response.msg,
                });
            }

        }
    } catch (error) {
        handleError(res, error);
    }
};
module.exports = { getUserTradingHistory };
