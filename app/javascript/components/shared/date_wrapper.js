import DateFnsUtils from "@date-io/date-fns";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";

const DateWrapper = (Component) => (props) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Component {...props} />
    </MuiPickersUtilsProvider>
  );
};

DateWrapper.displayName = "DateWrapper";

export default DateWrapper;
