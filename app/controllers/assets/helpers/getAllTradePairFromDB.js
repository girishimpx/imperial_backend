const Asset = require('../../../models/tradePairs')
const { buildErrObject } = require('../../../middleware/utils')

/**
 * Gets all items from database
 */
const getAllTradePairFromDB = () => {
  return new Promise((resolve, reject) => {
    Asset.find(
      {},
      '-updatedAt -createdAt',
      {
        sort: {
          tradepair: 1
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

module.exports = { getAllTradePairFromDB }
