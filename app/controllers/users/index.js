const { createUser } = require('./createUser')
const { deleteUser } = require('./deleteUser')
const { getUser } = require('./getUser')
const { getUsers } = require('./getUsers')
const { getProfile } = require('./getmyprofile')
const { updateUser } = require('./updateUser')
const { createKYC } = require('./createKYC')
const { check2FA } = require('./check2fa')
const { verifyEmail } = require('./tokenverify')
const { checkKyc } = require('./checkkyc')
const { imageApi } = require('./imageupload')
const { addPlan } = require('./addplan')
const { createPlan, getPlan, updatePlan, deletePlan, getMyplan } = require('./createPlan')
const { getMyKyc } = require('./getmykycverify')
const { checkApi } = require('./checkApi')
const { getMasters } = require('./getMasters')
const { IsKycSubmit } = require('./IsKycsubmit')
const { create_masket_request } = require('./craete_master_request')
const { updateResponseformaster } = require('./statusUpdateForrequest')
const { suspendUserAndMaster } = require('./Suspend')
const { getMasterRequest } = require('./getRequest')
const { getMasterRequestAdmin } = require('./getRequestforAdmin')
const { getMyNOtification } = require('./getnotification')
const { NotificationChecked } = require('./notification_checked')
const { getMAstersByAdmin } = require('./getMastersbyaDMIN')
const { googleRegister } = require('./googlesignin')
const { getUserslist } = require('./getUserList')
const { getSubscriptionHistory } = require('./getSubscriptionHistory')
const { masterRatings } = require('./masterRatings')
const { reSendEmail } = require('./reSendEmail')
const { tradingView } = require('./tradingView')
const { transferFunds } = require('./transferFunds')
const { getInternalTransfer } = require('./getInternalTransfer')
const { assetBills } = require('../wallet/helpers/assetBills')


module.exports = {
  getMyNOtification,
  NotificationChecked,
  createUser,
  deleteUser,
  googleRegister,
  suspendUserAndMaster,
  getMAstersByAdmin,
  create_masket_request,
  updateResponseformaster,
  IsKycSubmit,
  getMyKyc,
  checkApi,
  getMasters,
  getUser,
  reSendEmail,
  imageApi,
  createPlan,
  deletePlan,
  getPlan,
  getMyplan,
  updatePlan,
  addPlan,
  getUsers,
  getProfile,
  updateUser,
  verifyEmail,
  createKYC,
  check2FA,
  checkKyc,
  getMasterRequest,
  getMasterRequestAdmin,
  getUserslist,
  getSubscriptionHistory,
  masterRatings,
  tradingView,
  transferFunds,
  getInternalTransfer,
  assetBills
}
