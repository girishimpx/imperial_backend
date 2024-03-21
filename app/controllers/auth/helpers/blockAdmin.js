const { addHours } = require('date-fns')
const HOURS_TO_BLOCK = 2

const { buildErrObject } = require('../../../middleware/utils')

/**
 * Blocks a admin by setting blockExpires to the specified date based on constant HOURS_TO_BLOCK
 * @param {Object} admin - admin object
 */
const blockAdmin = (admin = {}) => {
  return new Promise((resolve, reject) => {
    admin.blockExpires = addHours(new Date(), HOURS_TO_BLOCK)
    admin.save((err, result) => {
      if (err) {
        return reject(buildErrObject(422, err.message))
      }
      if (result) {
        return resolve(buildErrObject(409, 'BLOCKED_ADMIN'))
      }
    })
  })
}

module.exports = { blockAdmin }
