const Admin = require('../../../models/admin')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Finds admin by ID
 * @param {string} id - admin´s id
 */
const findAdminById = (adminId = '') => {
  return new Promise((resolve, reject) => {
    Admin.findById(adminId, async (err, item) => {
      try {
        await itemNotFound(err, item, 'ADMIN DOES NOT EXIST')
        resolve(item)
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = { findAdminById }
