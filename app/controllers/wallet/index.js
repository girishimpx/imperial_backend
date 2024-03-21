const { createWallet } = require("./createWallet");
const { getAllWallet } = require("./getAllWallet");
const { getWalletById } = require("./getWalletById");
const { getWalletByAssetId } = require("./getWalletByAssetId");
const { updateWallet } = require("./updateWallet");
const { WalletBAlanceUpdateCron } = require("./CRON_Wallet_balanceupdate");
const { createDepositeAddress } = require("./createDepositeAddress");
const { subAccountBalance } = require("./subAccountBalance");
const { subAccountFundingBalance } = require("./subAccountFundingBalance");
const { getWalletByAddressid } = require("./getWalletByAddressid");
const { withdrawUser } = require("./withdrawUser");
const { withdrawOtp } = require("./withdrawOtp");
const { withDrawCheckOTP } = require("./withDrawCheckOTP");
const { tradepairs } = require("./tradepairs");
module.exports = {
  createWallet,
  getAllWallet,
  getWalletById,
  getWalletByAssetId,
  updateWallet,
  WalletBAlanceUpdateCron,
  createDepositeAddress,
  subAccountBalance,
  subAccountFundingBalance,
  getWalletByAddressid,
  withdrawUser,
  withdrawOtp,
  withDrawCheckOTP,
  tradepairs,
};
