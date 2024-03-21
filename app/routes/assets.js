const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')
const {
  createAsset,
  updateAsset,
  getAllAssets,
  getAssets,
  getAsset,
  getAssetBySymbol,
  insertTradepair,
  getAssetPairbyId,
  getAssetBytradepair,
  getAllAssetPair,
  getFutureAssets, get_Future_pairs,
  marketPairs,
  marketPairsbyName,
  createasseticon,
  getAssetIcon,
  marketPairsAuth,
  addFavPairs,
  addFavPairsFuture
} = require('../controllers/assets')
const {
  validateCreateAsset,
  validateUpdateAsset,
  validateGetAsset,
  validateAssetSymbol,
  validateinsertTradePair,
  validateGetAssetPairbyId,
  validateGetAssetByTradepair
} = require('../controllers/assets/validators')

const { roleAuthorization } = require('../controllers/auth')
/*
 * Assets routes
 */

/*
 * Get all items route
 */
router.get(
  '/getallasset',
  requireAuth,
  trimRequest.all,
  getAllAssets
)
/*
 * Get items route
 */
router.get(
  '/list',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  getAssets
)

router.post(
  '/marketPairs',
  // requireAuth,
  // roleAuthorization(['user']),
  // trimRequest.all,
  marketPairs
) 

router.post(
  '/addFavPairs',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  addFavPairs
) 

router.post(
  '/favpairsfuture',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  addFavPairsFuture
) 

router.post(
  '/marketPairsAuth',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  marketPairsAuth
)

router.post(
  '/marketPairs_by_name',
  // requireAuth,
  // roleAuthorization(['user']),
  // trimRequest.all,
  marketPairsbyName
)




/*
 * Get item route
 */
router.post(
  '/getassetbyId',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateGetAsset,
  getAsset
)



router.post(
  '/getassetbysymbol',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateAssetSymbol,
  getAssetBySymbol
)
/*
 * Create new item route
 */
router.post(
  '/create',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateCreateAsset,
  createAsset
)

router.post(
  '/inserttradepair',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateinsertTradePair,
  insertTradepair
) 

router.post(
  '/futurePairs',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  getFutureAssets
)

router.post(
  '/marketPairsAuth',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  marketPairsAuth 
)
/*
 * Future pairs 
 */
router.get(
  '/getfuturepairs',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  get_Future_pairs
)


router.post(
  '/gettradepairbyId',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateGetAssetPairbyId,
  getAssetPairbyId

)

router.post(
  '/getassetbytradepair',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateGetAssetByTradepair,
  getAssetBytradepair
)

router.get(
  '/getalltradepair',
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  getAllAssetPair
)

router.get(
  '/getalltradepairAdmin',
  requireAuth,
  roleAuthorization(["admin"]),
  trimRequest.all,
  getAllAssetPair
)


/*
 * Update item route
 */
router.patch(
  '/update/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateUpdateAsset,
  updateAsset
)


router.get(
  '/CreateAssetIcon',
  trimRequest.all,
  createasseticon
)

router.get(
  '/getAssetIcon',
  trimRequest.all,
  getAssetIcon
)


module.exports = router
