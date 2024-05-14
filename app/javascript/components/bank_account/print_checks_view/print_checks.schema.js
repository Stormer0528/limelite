import {object, number} from "yup";
import uniq from "lodash/uniq";

export default object().shape({
  printerSettingId: number().integer().positive().required(),
  checkedItems: object()
    .test(
      "at-least-one-checked",
      "At least one check must be selected",
      (checks = {}) => Object.values(checks).length > 0
    )
    .test(
      "uniq-check-numbers",
      "Check Numbers must be unique",
      (checkObj = {}) => {
        const checks = Object.values(checkObj);
        const numbers = checks.map(({number}) => number);
        return uniq(numbers).length === checks.length;
      }
    ),
});
