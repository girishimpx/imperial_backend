const { matchedData } = require("express-validator");
const User = require("../../models/user");
const trade = require("../../models/trade");
const copytrade = require("../../models/copytrade");
const { handleError } = require("../../middleware/utils");
const { isIDGood } = require("../../middleware/utils/isIDGood");
const {
  imperialApiAxios,
} = require("../../middleware/ImperialApi/imperialApi");

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const Cancel_Trade = async (req, res) => {
  try {
    const user = req.user;
    req = matchedData(req);
    // const ischeck = await isIDGood(req.id);
    const axios = require("axios");
    let data = JSON.stringify({
      instId: req.instId,
      ordId: req.ordId,
    });
    const keyfind = await copytrade.find({user_id: user._id})
    console.log(keyfind,'keyfind************************************************');
    // if(keyfind.length > 0){
    //   res.status(200).json({
    //     success: true,
    //     result: "",
    //     message: "Trade Cancelled Successfully",
    //   })
    // }else{
    //   res.status(400).json({
    //     success: false,
    //     result: "",
    //     message: "Trade Not Found",
    //   })
    // }

    let api = await imperialApiAxios(
      "post",
      "https://www.okx.com/api/v5/trade/cancel-order",
      `/api/v5/trade/cancel-order{"instId":"${req.instId}","ordId":"${req.ordId}"}`,
      data,keyfind[0].apikey,keyfind[0].secretkey,keyfind[0].passphrase
    );
    if (api.code == "0") {
      res.status(200).json({
        success: true,
        result: "",
        message: "Trade Cancelled Successfully",
      });
    } else {
      res.status(200).json({
        success: false,
        result: "",
        message: api.data[0].sMsg,
      });
    }
  } catch (error) {
    handleError(res, error);
  }
}
module.exports = { Cancel_Trade };