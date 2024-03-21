const { validateCreateUser } = require('./validateCreateUser')
const { validateDeleteUser } = require('./validateDeleteUser')
const { validateGetUser } = require('./validateGetUser')
const { validateUpdateUser } = require('./validateUpdateUser')
const { validateCreateKYC } = require('./validateCreateKYC')
const {  ValidateMAsterRequestResponse } = require('./validate_master_req_response')
const {  validateSuspend } = require('./validateSuspend')
const { validateCreateplan,validateUpdateplan } = require('./validateCreateplan')
module.exports = {
  validateCreateUser,
  validateDeleteUser,
  validateCreateplan,
  validateUpdateplan,
  validateGetUser,
  validateSuspend,
  ValidateMAsterRequestResponse,
  validateUpdateUser,
  validateCreateKYC
}
