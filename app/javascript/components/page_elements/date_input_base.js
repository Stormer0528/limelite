import {defaultProps} from "recompose";
import DatePicker from "material-ui-pickers/DatePicker";

const DateInputBase = defaultProps({
  autoOk: true,
  keyboard: true,
  format: "MM/dd/yyyy",
  InputProps: {
    className: "browser-default",
  },
  mask: [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/],
})(DatePicker);

export default DateInputBase;
