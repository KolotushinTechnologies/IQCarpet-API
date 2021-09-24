const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateUsersEmailValidationBasicInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";

  if (Validator.isEmpty(data.email)) {
    errors.email = "User email field is required!";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid!";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
