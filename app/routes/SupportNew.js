const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', { session: false})
const trimRequest = require('trim-request')





const { roleAuthorization } = require('../controllers/auth')

const {AddQuery,AdminAddQuery,getQuery,AdmingetQuery} = require('../controllers/supportNew/index')
const {validateAddMessage,validateAdminAddMessage,validateAdminGetMessage} = require('../controllers/supportNew/validator/index')




/*
Add Query
*/
router.post(
  '/addQuery',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  validateAddMessage,
  AddQuery
)

/*
user get his Query
*/
router.get(
  '/myQuery',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  getQuery
)


/*
Admin get query history with specific user
*/
router.post(
  '/adminqueryhistory',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateAdminGetMessage,
  AdmingetQuery
)

/*
Admin Reply
*/
router.post(
  '/adminReply',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateAdminAddMessage,
  AdminAddQuery
)







module.exports = router
