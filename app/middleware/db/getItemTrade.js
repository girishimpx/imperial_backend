const { itemNotFound } = require('../../middleware/utils')
const tradepair = require('../../models/tradePairs')

/**
 * Gets item from database by id
 * @param {string} id - item id
 */
const getItemTrade = (query = {}, model = {}) => {
  return new Promise((resolve, reject) => {
    console.log(query,"check")
    tradepair.findOne(query, async (err, item) => {
      try {
        await itemNotFound(err, item, 'NOT_FOUND')
        resolve(item)
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = { getItemTrade }
