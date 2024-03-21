const { validateResult } = require('../../../middleware/utils')
const validator = require('validator')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
const validateCreateKYC = [
    check('first_name')
        .exists()
        .withMessage('first_name MISSING')
        .not()
        .isEmpty()
        .withMessage('Please Enter First Name'),
    check('last_name')
        .exists()
        .withMessage('last_name MISSING')
        .not()
        .isEmpty()
        .withMessage('Please Enter Last Name')
        .trim(),
    check('phone_no')
        .exists()
        .withMessage('phone_no MISSING')
        .not()
        .isEmpty()
        .withMessage('Please Enter Phone Number')
        .trim(),
    check('gender')
        .exists()
        .withMessage('gender MISSING')
        .not()
        .isEmpty()
        .withMessage('Please Enter Gender')
        .trim(),
    check('dob')
        .exists()
        .withMessage('dob MISSING')
        .not()
        .isEmpty()
        .withMessage('Please Enter DOB')
        .trim(),
    check('country')
        .exists()
        .withMessage('country MISSING')
        .not()
        .isEmpty()
        .withMessage('Please Enter Country')
        .trim(),
    check('state')
        .exists()
        .withMessage('state MISSING')
        .not()
        .isEmpty()
        .withMessage('Please Enter State')
        .trim(),
    check('city')
        .exists()
        .withMessage('city MISSING')
        .not()
        .isEmpty()
        .withMessage('Please Enter City')
        .trim(),
    check('zipcode')
        .exists()
        .withMessage('zipcode MISSING')
        .not()
        .isEmpty()
        .withMessage('Please Enter Zip Code')
        .trim(),
    check('telegram')
        .exists()
        .withMessage('telegram MISSING')
        .not()
        .trim(),
    check('account_no')
        .exists()
        .withMessage('Account Number MISSING')
        .not()
        .trim(),
    check('ifsc_code')
        .exists()
        .withMessage('IFSC Code MISSING')
        .not()
        .trim(),
    check('bank')
        .exists()
        .withMessage('Bank Name MISSING')
        .not()
        .trim(),
    check('address')
        .exists()
        .withMessage('address MISSING')
        .not()
        .isEmpty()
        .withMessage('Please Enter Address')
        .trim(),
    check('document_type')
        .exists()
        .withMessage('document_type MISSING')
        .not()
        .isEmpty()
        .withMessage('Please Enter Document Type')
        .trim(),
    check('document_num')
        .exists()
        .withMessage('document_num MISSING')
        .not()
        .isEmpty()
        .withMessage('Please Enter Document Number')
        .trim(),
    check('document_image')
        .exists()
        .withMessage('document_image MISSING')
        .not()
        .isEmpty()
        .withMessage('Please Enter Document Image')
        .trim(),
    (req, res, next) => {
        
        validateResult(req, res, next)
    }
]

module.exports = { validateCreateKYC }
