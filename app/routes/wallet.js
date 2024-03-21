const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const { createWallet } = require('../controllers/wallet/createWallet')

const { getWalletByAddressid } = require('../controllers/wallet/getWalletByAddressid')

const { validatecreateWallet } = require('../controllers/wallet/validators/validateCreateWallet')
const { validateGetWalletByAssetId } = require('../controllers/wallet/validators/validateGetWalletByAssetId')
const { validateUpdateWallet } = require('../controllers/wallet/validators/validateUpdateWallet')


const { roleAuthorization } = require('../controllers/auth')
const { getAllWallet } = require('../controllers/wallet')
const { getWalletById } = require('../controllers/wallet/getWalletById')
const { getWalletByAssetId } = require('../controllers/wallet/getWalletByAssetId')
const { updateWallet } = require('../controllers/wallet/updateWallet')
const { WalletBAlanceUpdateCron, createDepositeAddress, subAccountBalance, subAccountFundingBalance, withdrawUser, withdrawOtp, withDrawCheckOTP,tradepairs } = require('../controllers/wallet')


router.post(
  '/createwallet',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  validatecreateWallet,
  createWallet
)


router.post(
  '/createDepositeAddress',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  createDepositeAddress
)

router.post(
  '/tradepairs',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  tradepairs
)

router.post(
  '/withdrawUser',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  withdrawUser
)

router.post(
  '/withdrawOtp',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  withdrawOtp
)

router.post(
  '/withDrawCheckOTP',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  withDrawCheckOTP
)

router.post(
  '/subAccountBalance',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  subAccountBalance
)

router.post(
  '/subAccountFundingBalance',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  subAccountFundingBalance
)
router.post(
  '/checkwallet',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  WalletBAlanceUpdateCron
)
router.post(
  '/createwalletbyAdmin',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validatecreateWallet,
  createWallet
)

router.get(
  '/getAllWallet',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  getAllWallet
)

router.get(
  '/getWalletById',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  getWalletById

)

router.post(
  '/getWalletaddressById',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  getWalletByAddressid

)



router.post(
  '/getWalletByAssetId',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  validateGetWalletByAssetId,
  getWalletByAssetId
)

router.post(
  '/UpdateWallet',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  validateUpdateWallet,
  updateWallet
)



module.exports = router
