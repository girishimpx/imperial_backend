const { matchedData } = require("express-validator");
const User = require("../../models/user");
const trade = require("../../models/trade");
const { handleError } = require("../../middleware/utils");
const { isIDGood } = require("../../middleware/utils/isIDGood");
const { imperialApiAxios } = require('../../middleware/ImperialApi/imperialApi')
const cpyTrade = require('../../models/copytrade')
const  mongoose  = require("mongoose");

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const getPositionHistory = async (req, res) => {
    try {
        const user = req.user;
        // req = matchedData(req)
        if (req.body.id) {

            const tdData = await cpyTrade.findOne({user_id: mongoose.Types.ObjectId(user._id)})
             console.log(req.body.id,'REQ DATA*********');
            // const response = await imperialApiAxios("get", `https://okx.com/api/v5/account/positions?instId=${req.body.id}&instType=FUTURES`, `/api/v5/account/positions?instId=${req.body.id}&instType=FUTURES`, {}, '93975967-ed47-4070-a436-329e22e14a1b', 'CBB7D9C9B6426A6562D2741A1E8AC9A6')
            const response = await imperialApiAxios("get", `https://www.okx.com/api/v5/account/positions?instId=${req.body.id}&instType=FUTURES`, `/api/v5/account/positions?instId=${req.body.id}&instType=FUTURES`, {}, tdData.apikey, tdData.secretkey, tdData.passphrase)
            // const response = await imperialApiAxios("get", `https://www.imperialx.exchange/api/v5/account/positions?instId=${req.body.id}&instType=FUTURES`, `/api/v5/account/positions?instId=${req.body.id}&instType=FUTURES`, {}, 'f546a753-21b1-452b-b02a-05a6019e27a2', 'F3F34BAAFE81DB29CE5FD38546C22ED9', 'Impx@123')

            console.log(response,'success	response');
            var data = [];
            // for (let i = 0; i < response.data.length; i++) {
            //     const dt = response.data[i]
            //     if (dt.pos === "1") {
            //         data.push(dt)
            //     }
            // }
               for (let i = 0; i < response.data.length; i++) {
                const dt = response.data[i]
                if (dt.pos > "0") {
                    data.push(dt)
                }
            }
            res.status(200).json({
                success: true,
                result: data,
                message: "Data Found Successfully",
            });
        } else {
            res.status(400).json({
                success: false,
                result: null,
                message: "Please Enter id",
            });
        }


    } catch (error) {
        handleError(res, error);
    }
};
module.exports = { getPositionHistory };
