const trade = require("../../models/copytrade");
const { handleError } = require("../../middleware/utils");
const {  imperialApiAxios} = require("../../middleware/ImperialApi/imperialApi");
const { matchedData } = require("express-validator");
const { encrypt } = require("../../middleware/auth/encrypt");
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const Ordre_history_for_future = async (req, res) => {
  try {
    const user = req.user;
    req = matchedData(req);

    const secKey = await trade.findOne({user_id : user._id})
    console.log(secKey,'secKEYsecKEY'); //apikey: secretkey: passphrase:

    const api = await imperialApiAxios("get",`https://www.okx.com/api/v5/trade/orders-history?instId=${req.instId}&instType=${req.instType}`,`/api/v5/trade/orders-history?instId=${req.instId}&instType=${req.instType}`,"",secKey.apikey,secKey.secretkey,secKey.passphrase)
    // const api = await imperialApiAxios("get",`https://www.imperialx.exchange/api/v5/trade/orders-history?instId=${req.instId}&instType=${req.instType}`,`/api/v5/trade/orders-history?instId=${req.instId}&instType=${req.instType}`,"",req.apiKey,req.secretKey,req.passphrase)
    console.log(api,'SUCCESS api');
  if (api.code == "0") {
    res.status(200).json({
      success: true,
      result: api.data,
      message: "Order Fetched successfully",
    });
  } else {
    
    res.status(400).json({
      success: false,
      result: "",
      message: api.msg,
    });
  }




   
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { Ordre_history_for_future };
