const { forgotPassword } = require('./forgotPassword')
const { getRefreshToken } = require('./getRefreshToken')
const { login } = require('./login')
const { loginByAdmin } = require('./loginByAdmin')
const { register } = require('./register')
const { resetPassword } = require('./resetPassword')
const { roleAuthorization } = require('./roleAuthorization')
const { verify } = require('./verify')
const { twoFactorAuth } = require('./twoFactorAuth')
const { verifyTwoFactorAuth } = require('./verifyTwoFactorAuth')
const { disable2FA } = require('./disable2FA')
const { checkapi } = require('./checkapi')
const { getKycList } = require('./getKycList')
const { verifyKyc } = require('./verifyKyc')
const { addMasterByAdmin } = require('./addMasterByAdmin')
const { modifyIp } = require('./modifyIp')
const { add_ip_beforetrade } = require('./add_ip_beforetrade')
const { getRedemlist } = require('./getRedemlist')
const { updateReedem } = require('./updateReedem')
const { getDepositHistory } = require('./getDepositHistory')
const { addDashboardImages } = require('./addDashboardImages')
const { getDashboardImages } = require('./getDashboardImages')
const { updateDashboardImages } = require('./updateDashboardImages')
const { deleteDashboardImages } = require('./deleteDashboardImages')
const { getDashboardImagesAdmin } = require('./getDashboardImagesAdmin')
const { createReferralAmount } = require('./referredAmount')
const { findReferralAmount } = require('./referredAmount')
const { userLastLogin } = require('./getUserLastLogin')
const { getCopyTradeHistory } = require('./getCopyTradehistory')
const { getAdminIncome } = require('./getAdminIncome')
const { getOrderDetails } = require('./getHistoricorders')

module.exports = {
  forgotPassword,
  getRefreshToken,
  login,
  loginByAdmin,
  register,
  resetPassword,
  roleAuthorization,
  verify,
  twoFactorAuth,
  verifyTwoFactorAuth,
  disable2FA,
  checkapi,
  getKycList,
  verifyKyc,
  addMasterByAdmin,
  modifyIp,
  add_ip_beforetrade,
  getRedemlist,
  updateReedem,
  getDepositHistory,
  createReferralAmount,
  addDashboardImages,
  getDashboardImages,
  updateDashboardImages,
  deleteDashboardImages,
  getDashboardImagesAdmin,
  findReferralAmount,
  userLastLogin,
  getCopyTradeHistory,
  getAdminIncome,
  getOrderDetails
}
