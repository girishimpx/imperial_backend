const { validateResult } = require("../../../middleware/utils");
const { check } = require("express-validator");

/**
 * Validates create new item request
 */
const validateTradeByPAir = [
  check("pair").not().isEmpty().withMessage("Pair required"),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

module.exports = { validateTradeByPAir };
