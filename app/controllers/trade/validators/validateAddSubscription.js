const { validateResult } = require("../../../middleware/utils");
const { check } = require("express-validator");

/**
 * Validates create new item request
 */
const validateAddSubscribe = [
  check("follower_id").not().isEmpty().withMessage("Follower Id is required"),
  check("amount").not().isEmpty().withMessage("Amount is required"),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

module.exports = { validateAddSubscribe };
