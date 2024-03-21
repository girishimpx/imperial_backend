const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates delete item request
 */
const ValidateMAsterRequestResponse = [
  check('_id')
    .not()
    .isEmpty()
    .withMessage('Id Required'),
    check('status').not()
    .isEmpty()
    .withMessage('Status required').isIn(["approved","rejected"]).withMessage('Invalid status'),
  check('reason').custom((value, { req }) => {
    if (req.body.status == 'rejected' && (!value || value.trim() === '')) {
      throw new Error('Reason is required when request is rejected');
    }
    return true;
  }),

  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { ValidateMAsterRequestResponse }
