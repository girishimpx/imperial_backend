const User = require('../../../models/user')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Finds user by id
 * @param {string} id - user id
 */
const findUser = (id = '') => {
  return new Promise((resolve, reject) => {
    User.findById(id, 'password email', async (err, user) => {
      try {
        await itemNotFound(err, user, 'USER DOES NOT EXIST')
        resolve(user)
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = { findUser }
