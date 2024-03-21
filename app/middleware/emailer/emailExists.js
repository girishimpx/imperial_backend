const User = require('../../models/user')
const { buildErrObject } = require('../../middleware/utils')

/**
 * Checks User model if user with an specific email exists
 * @param {string} email - user email
 */
const emailExists = (email = '') => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        email
      },
      (err, item) => {
        if (err) {
          return reject(buildErrObject(422, err.message))
        }

        if (item) {
          return reject(buildErrObject(422, 'Email Already Exists'))
        }
        resolve(false)
      }
    )
  })
}

const gemailExists = (email = '') => {
  return new Promise((resolve, reject) => {
    User.findOne(
      { $and: [ { email:email },  { isgoogle:"true" } ] },
      (err, item) => {
        if (err) {
          return reject(buildErrObject(422, err.message))
        }

        if (item) {
console.log("item",item)
           resolve(true)
        }
        resolve(false)
      }
    )
  })
}

module.exports = { emailExists,gemailExists }
