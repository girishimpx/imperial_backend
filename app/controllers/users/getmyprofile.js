const User = require('../../models/user')
const { handleError } = require('../../middleware/utils')
const { getItemById } = require("../../middleware/db");
const wallet = require('../../models/wallet')
const getBalance = require("../wallet/getBalanceUsdt")
/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getProfile = async (req, res) => {
  try {
    const user_id = req.user._id
    const user = await getItemById(user_id, User)
    let total_price_in_usd = 0
    const data = await wallet.find({ user_id: user_id }).populate("asset_id")
    for (j = 0; j < data.length; j++) {

      let usdtBalance = getBalance.getBalanceUsdt(data[j].symbol, data[j].balance)
      total_price_in_usd = total_price_in_usd + usdtBalance

    }
    console.log("total")
    res.status(200).json({
      success: true,
      result: user, total_price_in_usd,
      message: "User found successfully"
    })
    // res.status(200).json(await getItemById(user_id, User))
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getProfile }
