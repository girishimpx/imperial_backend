const Asset = require('../../../models/assets')
const { buildErrObject } = require('../../../middleware/utils')

/**
 * Checks if a city already exists excluding itself
 * @param {string} id - id of item
 * @param {string} source - source of item
 */
const assetExistsExcludingItself = (id = '', source = '') => {
  return new Promise((resolve, reject) => {
    Asset.findOne(
      {
        source,
        _id: {
          $ne: id
        }
      },
      (err, item) => {
        if (err) {
          return reject(buildErrObject(422, err.message))
        }

        if (item) {
          return reject(buildErrObject(422, 'ASSET_ALREADY_EXISTS'))
        }

        resolve(false)
      }
    )
  })
}

module.exports = { assetExistsExcludingItself }
