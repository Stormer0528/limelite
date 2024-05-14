import {KeyboardDatePicker} from "@material-ui/pickers";
import KeyboardDate from "./keyboard_date";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

export default {
  title: "Shared/KeyboardDate",
  component: KeyboardDate,
};

export const DefaultComponent = () => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div>
        <KeyboardDatePicker label="with Null date" value={null} />
        <br />
        <br />
        <KeyboardDatePicker label="with undefined date" value={undefined} />
        <br />
        <br />
        <KeyboardDatePicker label="with string date" value={""} />
        <br />
        <br />
        <KeyboardDatePicker
          label="with regular string date"
          value={"2019-01-01"}
        />
        <br />
        <br />
        <KeyboardDatePicker
          label="with dateobj"
          value={new Date("2019-01-01")}
        />
        <br />
        <br />
      </div>
    </MuiPickersUtilsProvider>
  );
};

export const SharedComponent = () => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div>
        <KeyboardDate
          value={null}
          autoOk
          id="start-date"
          name="afterDate"
          variant="inline"
          label="with Null date"
        />{" "}
        <br />
        <br />
        <KeyboardDate
          autoOk
          id="start-date"
          name="afterDate"
          variant="inline"
          label="with undefined date"
        />{" "}
        <br />
        <br />
        <KeyboardDate
          autoOk
          id="start-date"
          name="afterDate"
          variant="inline"
          value={""}
          label="with emptry string date"
        />{" "}
        <br />
        <br />
        <KeyboardDate
          autoOk
          id="start-date"
          name="afterDate"
          variant="inline"
          value={"2019-09-01"}
          label="with date string "
        />{" "}
        <br />
        <br />
      </div>
    </MuiPickersUtilsProvider>
  );
};
