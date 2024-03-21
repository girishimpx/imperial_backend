const { validateResult } = require('../../../middleware/utils')
const validator = require('validator')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
const validateCreateplan = [
  check('per_month')
    .exists()
    .withMessage('PER MONTH MISSING')
    .not()
    .isEmpty()
    .withMessage('IS EMPTY'),
 
  check('per_year')
    .exists()
    .withMessage('PER YEAR MISSING')
    .not()
    .isEmpty()
    .withMessage('IS EMPTY')
    .trim(),
  
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

const validateUpdateplan = [
    check('per_month')
      .exists()
      .withMessage('PER MONTH MISSING')
      .not()
      .isEmpty()
      .withMessage('IS EMPTY'),
   
    check('per_year')
      .exists()
      .withMessage('PER YEAR MISSING')
      .not()
      .isEmpty()
      .withMessage('IS EMPTY')
      .trim(),
    
    (req, res, next) => {
      validateResult(req, res, next)
    }
  ]

module.exports = { validateCreateplan,validateUpdateplan }
