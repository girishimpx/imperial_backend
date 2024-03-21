const { getItemById } = require("../../middleware/db");
const wallet = require("../../models/wallet");
const asset = require("../../models/assets");
const { handleError, isIDGood } = require("../../middleware/utils");
const { matchedData } = require("express-validator");

const updateWallet = async (req, res) => {
  try {
    const user = req.user;
    req = matchedData(req);
    const id = await isIDGood(req.asset_id);
    const data = await wallet.findOneAndUpdate(
      { user_id: user._id, asset_id: req.asset_id },
      { balance: req.balance, escrow_balance: req.escrow_balance },
      (err, done) => {
        if (err) {
          res.status(400).json({
            success: false,
            result: null,
            message: "Wallet did not updated",
          });
        }
        if (done) {
          res.status(200).json({
            success: true,
            result: done,
            message: "Wallet updated successfully",
          });
        }
      }
    );
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { updateWallet };
