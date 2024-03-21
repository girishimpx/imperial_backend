const { isIDGood, handleError } = require('../../middleware/utils')
const { matchedData } = require('express-validator')
const { updateProfileInDB } = require('./helpers')

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateProfile = async (req, res) => {
  try {
    const id = await isIDGood(req.user._id)
    req = matchedData(req)
    const response = await updateProfileInDB(req, id)
    res.status(200).json({
      success : true,
      result:  response,
      message: "Profile updated successfully"
    })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { updateProfile }
