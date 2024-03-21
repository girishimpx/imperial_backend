const { validateResult } = require("../../../middleware/utils");
const { check } = require("express-validator");

/**
 * Validates create new item request
 */


const exchange = ["imperial","binance","okx"]
const validateEditSubscribe = [
  check("apikey").optional(),
  check("secretkey").optional(),
  check("passphrase").optional(),
  check("api_name").optional(),
  check("exchange").not()
  .isEmpty()
  .withMessage('Exchange is required').isIn(exchange).withMessage(`Invalid exchange,possible exhnages is [${exchange}]`),
  check("spot").not().isEmpty().withMessage("spot is required").isBoolean().withMessage("Spot must be boolean"),
  check("margin").not().isEmpty().withMessage("margin is required").isBoolean().withMessage("Margin must be boolean"),
  check("future").not().isEmpty().withMessage("future is required").isBoolean().withMessage("Future must be boolean"),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

module.exports = { validateEditSubscribe };
