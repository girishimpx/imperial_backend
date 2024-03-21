const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')
const { 
    getAssetBySymbol,
    getAllAssets
  } = require('../controllers/assets')
  const { 
    validateGetAsset
  } = require('../controllers/assets/validators')

router.get('/all', getAllAssets)
router.get(
    '/:asset',
    trimRequest.all,
    validateGetAsset,
    getAssetBySymbol
  )

module.exports = router