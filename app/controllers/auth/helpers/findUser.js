const User = require('../../../models/user')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Finds user by email
 * @param {string} email - user´s email
 */
const findUser = (email = '') => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        email
      },
      'password loginAttempts blockExpires name email role verified verification email_verify trader_type suspend kyc_verify iseligible referred_by_id referaldeposit',
      async (err, item) => {
        try {
          await itemNotFound(err, item, 'Invalid Credential')
          resolve(item)
        } catch (error) {
          reject(error)
        }
      }
    )
  })
}

module.exports = { findUser }
