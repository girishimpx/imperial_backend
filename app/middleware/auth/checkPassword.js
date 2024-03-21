const { buildErrObject } = require('../../middleware/utils')

/**
 * Checks is password matches
 * @param {string} password - password
 * @param {Object} user - user object
 * @returns {boolean}
 */
const checkPassword = (password = '', user = {}) => {
  const userpassword = user.password
  console.log(password,"users")
  return new Promise((resolve, reject) => {
    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        return reject(buildErrObject(422, err.message))
      }
      if (!isMatch) {
        resolve(false)
      }
      resolve(true)
    })
  })
}

module.exports = { checkPassword }
