const { validateResult } = require("../../../middleware/utils");
const { check } = require("express-validator");

/**
 * Validates create new item request
 */


const exchange = ["imperial","binance","okx"]
const validateDisableSubscribe = [
  check("_id").not().isEmpty().withMessage("_id is required"),
  check("status").not().isEmpty().withMessage("status is required"),
  check("exchange").not()
  .isEmpty()
  .withMessage('Exchange is required').isIn(exchange).withMessage(`Invalid exchange,possible exhnages is [${exchange}]`),
  

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

module.exports = { validateDisableSubscribe };
