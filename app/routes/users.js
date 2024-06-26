const express = require("express");
const router = express.Router();
require("../../config/passport");
const passport = require("passport");
// const image  = require('../.././public/image/download.png')
const requireAuth = passport.authenticate("jwt", {
  session: false,
});
const trimRequest = require("trim-request");

const ejs = require("ejs");
const path = require("path");
const multer = require("multer");

const { roleAuthorization } = require("../controllers/auth");


const {
  getUsers,
  getProfile,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  createKYC,
  check2FA,
  verifyEmail,
  checkKyc,
  imageApi,
  updatePlan,
  createPlan,
  deletePlan,
  getPlan,
  addPlan,
  getMyKyc,
  checkApi,
  getMasters,
  IsKycSubmit,
  create_masket_request,
  updateResponseformaster,
  suspendUserAndMaster,
  getMasterRequest,
  getMasterRequestAdmin,
  getMyNOtification,
  NotificationChecked, getMAstersByAdmin,
  googleRegister,
  getMyplan,
  getUserslist,
  getSubscriptionHistory,
  masterRatings,
  reSendEmail,
  tradingView,
  transferFunds,
  getInternalTransfer,
  assetBills,
  updateUserProfile
} = require("../controllers/users");

const {
  validateCreateUser,
  validateGetUser,
  validateUpdateUser,
  validateDeleteUser,
  validateCreateplan,
  validateUpdateplan,
  validateCreateKYC,
  ValidateMAsterRequestResponse,
  validateSuspend
} = require("../controllers/users/validators");

const {
  validateRegister,
  validateLogin,
} = require("../controllers/auth/validators");

const { register, login } = require("../controllers/auth");
/*
 * Users routes
 */

/*
 * Get items route
 */
router.post(
  "/getMastersbyQuery",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  getMasters
);

router.post(
  "/updateprofile",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  updateUserProfile
);

router.post(
  "/rating",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  masterRatings
);

router.post("/register", trimRequest.all, validateRegister, register);
router.post("/resendemail", trimRequest.all, reSendEmail);
router.post("/assetBills", trimRequest.all, requireAuth, roleAuthorization(["user"]), assetBills);

router.post("/googleregister", googleRegister);

/*
    my kyc detail
*/

router.post(
  "/deleteplan",
  trimRequest.all,
  deletePlan
);


router.get(
  "/getplan",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  getPlan
);

router.post(
  "/tradingView",
  // requireAuth,
  // roleAuthorization(["user"]),
  trimRequest.all,
  tradingView
);

router.get(
  "/getmyplan",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  getMyplan
);

router.get(
  "/mykycdetail",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  getMyKyc
);

router.post(
  "/transferFunds",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  transferFunds
);

/* kyc submit check*/

router.get(
  "/kycsybmit",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  IsKycSubmit
);

router.get(
  "/getInternalTransfer",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  getInternalTransfer
);

router.get(
  "/getBalances",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  checkApi
);

/*get masters*/


/*get masters*/
router.get(
  "/getMastersAdmin",
  requireAuth,
  roleAuthorization(["admin"]),
  trimRequest.all,
  getMAstersByAdmin
);

router.get(
  "/getUsersAdmin",
  requireAuth,
  roleAuthorization(["admin"]),
  trimRequest.all,
  getUserslist
);

/*
* Get subscription 
 */

router.get(
  "/getSubscriptionHistory",
  requireAuth,
  roleAuthorization(["admin"]),
  trimRequest.all,
  getSubscriptionHistory
);


/*get masters*/


router.get(
  "/get_profile",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  getProfile
);

/*
get master request for admin
*/
router.get(
  "/getMasterRequestsAdmin",
  requireAuth,
  roleAuthorization(["admin"]),
  trimRequest.all,
  getMasterRequestAdmin
);

/*
get master request for user
*/
router.get(
  "/getMasterRequestsuser",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  getMasterRequest
);



/*login*/
router.post("/login", trimRequest.all, validateLogin, login);

router.post(
  "/createKyc",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  validateCreateKYC,
  createKYC
);

/*
 * Create master request
 */
router.get(
  "/mademasterRequest",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  create_masket_request
);


/*
 * update master request 
 */
router.post(
  "/masterrequestupdate",
  requireAuth,
  roleAuthorization(["admin"]),
  trimRequest.all,
  ValidateMAsterRequestResponse,
  updateResponseformaster
);


/*
 * Get notification 
 */
router.get(
  "/getMynotification",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  getMyNOtification
);


/*
 * notification  checked and delete that notification
 */
router.post(
  "/notification_checked",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  validateGetUser,
  NotificationChecked
);

/*
 * suspend api request 
 */
router.post(
  "/suspendUsersandMasters",
  requireAuth,
  roleAuthorization(["admin"]),
  trimRequest.all,
  validateSuspend,
  suspendUserAndMaster
);




router.post(
  "/",
  requireAuth,
  roleAuthorization(["admin"]),
  trimRequest.all,
  validateCreateUser,
  createUser
);

const currentTime = Date.now();


const imageupload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename(req, res, cb) {
      cb(
        null,
        res.originalname.replace(/\.[^/.]+$/, "") +
        "_" +
        currentTime +
        path.extname(res.originalname)
      );
    },
  }),
});

/*image upload*/
router.post(
  "/imageUpload",
  requireAuth,
  roleAuthorization(["user", "admin"]),
  trimRequest.all,
  imageupload.single("image"),
  imageApi
);
router.post(
  "/imageUploadAdmin",
  // requireAuth,
  // roleAuthorization(["admin"]),
  trimRequest.all,
  imageupload.single("image"),
  imageApi
);

/*
 * check2fa
 */
router.get("/check2fa", requireAuth, trimRequest.all, check2FA);

/*
 * TOken verify
 */

router.get("/tokenVerify", requireAuth, trimRequest.all, verifyEmail);

/*
 * KYC verify
 */

router.get("/kycVerify", requireAuth, trimRequest.all, checkKyc);

// router.get('/emailsjs',(req,res)=>{
//   const filedata = path.join(__dirname, '../.././views/verify.ejs')
//   res.render(filedata, {username: "arshad",image:`http://174.138.37.4/imperialApi/image/logo.png`,url:`http://174.138.37.4/imperialExchange/tokenpage/12345`})
// })

/*
 * Get item route
 */
router.get(
  "/:id",
  requireAuth,
  roleAuthorization(["admin"]),
  trimRequest.all,
  validateGetUser,
  getUser
);

router.get(
  "/get_mastertrader_by_id/:id",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  validateGetUser,
  getUser
);



/*
 * Update item route
 */
router.patch(
  "/:id",
  requireAuth,
  roleAuthorization(["admin"]),
  trimRequest.all,
  validateUpdateUser,
  updateUser
);

/*
 * Delete item route
 */
router.delete(
  "/:id",
  requireAuth,
  roleAuthorization(["admin"]),
  trimRequest.all,
  validateDeleteUser,
  deleteUser
);

router.post(
  "/createplan",
  requireAuth,
  roleAuthorization(["admin"]),
  trimRequest.all,
  validateCreateplan,
  createPlan
);
router.post(
  "/updateplan",
  requireAuth,
  roleAuthorization(["admin"]),
  trimRequest.all,
  validateUpdateplan,
  updatePlan
);


router.post(
  "/addplan",
  requireAuth,
  roleAuthorization(["user"]),
  trimRequest.all,
  addPlan
);

module.exports = router;
