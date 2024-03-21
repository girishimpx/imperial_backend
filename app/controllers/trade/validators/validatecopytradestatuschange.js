const { validateResult } = require("../../../middleware/utils");
const { check } = require("express-validator");

/**
 * Validates create new item request
 */
const  Validate_copy_trade_status = [
  check("status").not().isEmpty().withMessage("Status required"),
  check("exchange").not().isEmpty().withMessage("Exchange required").not().isIn(["imperial,okx,binance"]).withMessage("Exchange must be one of [imperial,okx,binance] "),
  

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

module.exports = { Validate_copy_trade_status };
