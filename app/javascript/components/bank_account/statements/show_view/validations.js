import isDate from "lodash/isDate";
import isEmpty from "lodash/isEmpty";

// Statement Validations
//------------------------------------------------------------------------------
const isValid = ({started_at, ended_at, starting_balance, ending_balance}) => {
  const validations = [
    validateString(started_at),
    validateString(ended_at),
    validateString(starting_balance),
    validateString(ending_balance),
  ];

  return validations.every(check => check === true);
};

export function validateDate(date) {
  return isDate(date);
}

export function validateString(str) {
  return str && !isEmpty(str);
}

export default isValid;
