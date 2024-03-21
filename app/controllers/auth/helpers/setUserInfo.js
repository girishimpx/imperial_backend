/**
 * Creates an object with user info
 * @param {Object} req - request object
 */
const setUserInfo = (req = {}) => {
  return new Promise((resolve) => {

    let user = {
      _id: req._id,
      name: req.name,
      email: req.email,
      role: req.role,
      trader_type: req.trader_type,
      kyc_verify: req.kyc_verify,
      suspend: req.suspend,
      iseligible: req.iseligible,
      referred_by_id: req.referred_by_id,
      referaldeposit: req.referaldeposit
    }
    resolve(user)
  })
}

module.exports = { setUserInfo }
