const { itemNotFound } = require('../../middleware/utils')
const asset = require('../../models/assets')

/**
 * Gets item from database by id
 * @param {string} id - item id
 */
const getItem = (query = {}, model = {}) => {
  return new Promise((resolve, reject) => {
    console.log(query,"okk")
    asset.findOne(query, async (err, item) => {
      try {
        await itemNotFound(err, item, 'NOT_FOUND')
        resolve(item)
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = { getItem }
