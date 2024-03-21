const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')



const { roleAuthorization } = require('../controllers/auth')

const {validateAddQuery,validateAdminGetQuery,Validate_Admin_Reply} = require('../controllers/support/validator/index')
const {AddQuery,getQuery,AdmingetQuery,ReplyForQuery} = require('../controllers/support/index')









/*
Add Query
*/
router.post(
  '/adminReply',
  requireAuth,
  roleAuthorization(['admin',]),
  trimRequest.all,
  Validate_Admin_Reply,
  ReplyForQuery
)


/*
Add Query
*/
router.post(
  '/addQuery',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  validateAddQuery,
  AddQuery
)




/*
Admin get quesries by user id
*/
router.post(
  '/admingetQueries',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateAdminGetQuery,
  AdmingetQuery
)




/*
get my query 
*/
router.get(
  '/getmyqueries',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  getQuery
)





module.exports = router
