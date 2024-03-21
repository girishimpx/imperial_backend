const Asset = require('../../../models/assets')
const { buildErrObject } = require('../../../middleware/utils')

/**
 * Gets all items from database
 */
const getAllAssetsItemsFromDB = () => {
  return new Promise((resolve, reject) => {
    Asset.find(
      {},
      '-updatedAt -createdAt',
      {
        sort: {
          symbol: 1
        }
      },
      (err, items) => {
        if (err) {
          return reject(buildErrObject(422, err.message))
        }
        resolve(items)
      }
    )
  })
}

module.exports = { getAllAssetsItemsFromDB }
