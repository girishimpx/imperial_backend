const Asset = require('../../../models/assets')
const { buildErrObject } = require('../../../middleware/utils')

/**
 * Checks if a asset already exists in database
 * @param {string} source - asset symbol of item
 */
const assetExists = (source = '') => {
  return new Promise((resolve, reject) => {
    Asset.findOne(
      {
        source
      },
      (err, item) => {
        if (err) {
          return reject(buildErrObject(422, err.message))
        }

        if (item) {
          return reject(buildErrObject(422, 'Asset already exists'))
        }
        resolve(false)
      }
    )
  })
}

module.exports = { assetExists }
