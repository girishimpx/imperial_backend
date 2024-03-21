const { buildErrObject } = require('./buildErrObject')

/**
 * Item not found
 * @param {Object} err - error object
 * @param {Object} item - item result object
 * @param {string} message - message
 */
const itemNotFound = (err = {}, item = {}, message = 'NOT_FOUND') => {
  return new Promise((resolve, reject) => {
    if (err) {
      return reject(buildErrObject(400, err.message))
    }
    if (!item) {
      return reject(buildErrObject(400, message))
    }
    resolve()
  })
}

module.exports = { itemNotFound }
