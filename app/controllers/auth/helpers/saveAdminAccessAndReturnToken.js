const AdminAccess = require('../../../models/adminAccess')
const { setUserInfo } = require('./setUserInfo')
const { generateToken } = require('./generateToken')
const {
  getIP,
  getBrowserInfo,
  getCountry,
  buildErrObject
} = require('../../../middleware/utils')

/**
 * Saves a new admin access and then returns token
 * @param {Object} req - request object
 * @param {Object} admin - admin object
 */
const saveAdminAccessAndReturnToken = (req = {}, admin = {}) => {
  return new Promise((resolve, reject) => {
    const adminAccess = new AdminAccess({
      email: admin.email,
      ip: getIP(req),
      browser: getBrowserInfo(req),
      country: getCountry(req)
    })
    adminAccess.save(async (err) => {
      try {
        if (err) {
          return reject(buildErrObject(422, err.message))
        }
        const adminInfo = await setUserInfo(admin)
        // Returns data with access token
        resolve({
          token: generateToken(admin._id),
          admin: adminInfo
        })
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = { saveAdminAccessAndReturnToken }
