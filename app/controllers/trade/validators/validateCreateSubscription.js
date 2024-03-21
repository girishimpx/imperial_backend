const { validateResult } = require("../../../middleware/utils");
const { check } = require("express-validator");

/**
 * Validates create new item request
 */

const exchange = ["imperial", "binance", "okx"]
const validateCreateSubscription = [
  check("apikey").not().isEmpty().withMessage("Apikey is required"),
  check("secretkey").not().isEmpty().withMessage("Secretkey is required"),
  check("api_name").not().isEmpty().withMessage("Api name is required"),
  check("permission").not().isEmpty().withMessage("Permission is required"),
  check("exchange").not().isEmpty().withMessage("Exchange is required").isIn(exchange).withMessage(`Invalid exchange,possible exchanges is [${exchange}]`),
  check("passphrase").not().isEmpty().withMessage("passphrase is required"),
  check("spot").not().isEmpty().withMessage("spot is required").isBoolean().withMessage("Spot must be boolean"),
  check("margin").not().isEmpty().withMessage("margin is required").isBoolean().withMessage("Margin must be boolean"),
  check("future").not().isEmpty().withMessage("future is required").isBoolean().withMessage("Future must be boolean"),
  check("sub_expire").optional(),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

module.exports = { validateCreateSubscription };
