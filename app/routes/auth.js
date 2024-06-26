const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const {
  register,
  verify,
  forgotPassword,
  resetPassword,
  getRefreshToken,
  login,
  loginByAdmin,
  roleAuthorization,
  twoFactorAuth,
  verifyTwoFactorAuth,
  disable2FA,
  checkapi,
  getKycList,
  verifyKyc,
  addMasterByAdmin,
  modifyIp,
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
} = require('../controllers/auth')

const {
  validateRegister,
  validateVerify,
  validateForgotPassword,
  validateResetPassword,
  validateLogin,
  validate2fa,
  validateVerifyKyc,
  validateToken,
  validateAddMasterByAdmin,
  validateReferralAmount
} = require('../controllers/auth/validators')


const {
  getUsers
} = require('../controllers/users')


/*
 * Auth routes
 */

/*
 * Register route
 */

router.post('/check', checkapi)

router.post('/login', trimRequest.all, validateLogin, loginByAdmin)

router.post(
  '/referralAmount',
  requireAuth,
  validateReferralAmount,
  roleAuthorization(['admin']),
  trimRequest.all,
  createReferralAmount
)

router.post(
  '/getreferralAmount',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  findReferralAmount
)


router.post(
  '/modifyIp',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  modifyIp
)

router.get(
  '/usersList',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  getUsers
)

router.post(
  '/addDashboardImages',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  addDashboardImages
)

router.post(
  '/getDashboardImages',
  // requireAuth,
  // roleAuthorization(['admin']),
  trimRequest.all,
  getDashboardImages
)

router.post(
  '/getDashboardImagesAdmin',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  getDashboardImagesAdmin
)

router.post(
  '/updateDashboardImages',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  updateDashboardImages
)

router.post(
  '/deleteDashboardImages',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  deleteDashboardImages
)

router.get(
  '/kycsList',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  getKycList
)

router.post(
  '/verifyKyc',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateVerifyKyc,
  verifyKyc
)

/*
 * Generate two factor Auth
 */

router.post(
  '/generate2fa',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  twoFactorAuth
)

/*
 *Verify two factor Auth
 */

router.post(
  '/verify2fa',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  validate2fa,
  verifyTwoFactorAuth
)



/*
 *Disable two factor Auth
 */

router.post(
  '/disable2fa',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  disable2FA
)

/*
 * Verify route
 */
router.post('/verifyotp', trimRequest.all, validateVerify, verify)

/*
 * Forgot password route
 */
router.post('/forgot', trimRequest.all, validateForgotPassword, forgotPassword)

/*
 * Reset password route
 */
router.post('/reset', trimRequest.all, validateResetPassword, resetPassword)

/*
 * Get new refresh token
 */
router.get(
  '/token',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  getRefreshToken
)

router.post(
  '/addMasterByAdmin',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateAddMasterByAdmin,
  addMasterByAdmin

)

router.get(
  '/getredemlist',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  getRedemlist

)

router.post(
  '/updatereedem',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  updateReedem
)

router.post(
  '/getDepositHistory',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  getDepositHistory
)

router.post(
  '/getUsers',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  userLastLogin
)

router.post(
  '/getCopyTradeHistory',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  getCopyTradeHistory
)

router.post(
  '/getAdminIncome',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  getAdminIncome
)
/*
 * Login route
 */


router.post(
  '/getOrder',
  getOrderDetails
)

module.exports = router
