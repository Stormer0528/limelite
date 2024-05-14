// import {useState, useCallback} from "react";
import PropTypes from "prop-types";
import {compose} from "redux";
import {graphql} from "react-apollo";

import gql from "graphql-tag";

import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";

// Date Functions
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  addQuarters,
  subQuarters,
} from "date-fns/esm";
import toDate from "date-fns/toDate";

const DateSelector = ({
  value = "Custom",
  handleValueChange = function () {},
  handleStartDateChange = function () {},
  handleEndDateChange = function () {},
}) => {
  const elem = document.getElementById("top-navbar");
  const currentYear = new Date().getFullYear();

  let { fiscalYear = `${ currentYear}` } = elem.dataset;
  fiscalYear = Number(fiscalYear);

  return (
    <FormControl>
      <InputLabel htmlFor="date-selector">{""}</InputLabel>
      <Select
        autoWidth
        displayEmpty
        value={value}
        onChange={handleChange(
          handleValueChange,
          handleStartDateChange,
          handleEndDateChange,
          fiscalYear
        )}
        style={{marginTop: 0}}
        inputProps={{
          name: "Dates",
          id: "date-selector",
        }}
      >
        {Object.keys(Periods).map((val) => (
          <MenuItem key={val} value={val}>
            {val}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Date Presets</FormHelperText>
    </FormControl>
  );
};

// Callback
const handleChange = (
  handleValueChange,
  handleStartDateChange,
  handleEndDateChange,
  fiscalYear
) => ({target: {value}}) => {
  if (Periods[value]) {
    Periods[value]({handleStartDateChange, handleEndDateChange, fiscalYear});
  }

  handleValueChange(value);
};

const Periods = {
  Custom: ({handleStartDateChange, handleEndDateChange}) => {
    handleStartDateChange(null);
    handleEndDateChange(null);
  },
  Today: ({handleStartDateChange, handleEndDateChange}) => {
    const today = new Date();
    handleStartDateChange(startOfDay(today));
    handleEndDateChange(endOfDay(today));
  },
  Yesterday: ({handleStartDateChange, handleEndDateChange}) => {
    const yesterday = subDays(new Date(), 1);
    handleStartDateChange(startOfDay(yesterday));
    handleEndDateChange(endOfDay(yesterday));
  },
  Tomorrow: ({handleStartDateChange, handleEndDateChange}) => {
    const tomorrow = addDays(new Date(), 1);
    handleStartDateChange(startOfDay(tomorrow));
    handleEndDateChange(endOfDay(tomorrow));
  },
  "First Interim": ({
    handleStartDateChange,
    handleEndDateChange,
    fiscalYear,
  }) => {
    handleStartDateChange(startOfDay(toDate(`${fiscalYear}-07-01`)));
    handleEndDateChange(endOfDay(toDate(`${fiscalYear}-10-31`)));
  },
  "Second Interim": ({
    handleStartDateChange,
    handleEndDateChange,
    fiscalYear,
  }) => {
    handleStartDateChange(startOfDay(toDate(`${fiscalYear}-07-01`)));
    handleEndDateChange(endOfDay(toDate(`${fiscalYear + 1}-01-31`)));
  },
  "This Week": ({handleStartDateChange, handleEndDateChange, fiscalYear}) => {
    const date = new Date();
    date.setFullYear(fiscalYear);
    handleStartDateChange(startOfWeek(date));
    handleEndDateChange(endOfWeek(date));
  },
  "This Month": ({handleStartDateChange, handleEndDateChange, fiscalYear}) => {
    const date = new Date();
    date.setFullYear(fiscalYear);
    handleStartDateChange(startOfMonth(date));
    handleEndDateChange(endOfMonth(date));
  },
  "This Quarter": ({
    handleStartDateChange,
    handleEndDateChange,
    fiscalYear,
  }) => {
    const date = new Date();
    date.setFullYear(fiscalYear);
    handleStartDateChange(startOfQuarter(date));
    handleEndDateChange(endOfQuarter(date));
  },
  "This Year": ({handleStartDateChange, handleEndDateChange, fiscalYear}) => {
    const date = new Date();
    date.setFullYear(fiscalYear);
    handleStartDateChange(beginningOfFiscalYear(fiscalYear));
    handleEndDateChange(endOfFiscalYear(fiscalYear));
  },
  "This Week-to-date": ({
    handleStartDateChange,
    handleEndDateChange,
    fiscalYear,
  }) => {
    const date = new Date();
    date.setFullYear(fiscalYear);
    handleStartDateChange(startOfWeek(date));
    handleEndDateChange(date);
  },
  "This Month-to-date": ({
    handleStartDateChange,
    handleEndDateChange,
    fiscalYear,
  }) => {
    const date = new Date();
    date.setFullYear(fiscalYear);
    handleStartDateChange(startOfMonth(date));
    handleEndDateChange(date);
  },
  "This Quarter-to-date": ({
    handleStartDateChange,
    handleEndDateChange,
    fiscalYear,
  }) => {
    const date = new Date();
    date.setFullYear(fiscalYear);
    handleStartDateChange(startOfQuarter(date));
    handleEndDateChange(date);
  },
  "This Year-to-date": ({
    handleStartDateChange,
    handleEndDateChange,
    fiscalYear,
  }) => {
    const date = new Date();
    date.setFullYear(fiscalYear);
    handleStartDateChange(beginningOfFiscalYear(fiscalYear));
    handleEndDateChange(date);
  },
  "Last Week": ({handleStartDateChange, handleEndDateChange, fiscalYear}) => {
    const date = new Date();
    date.setFullYear(fiscalYear);
    const start_date = subWeeks(date, 1);
    handleStartDateChange(startOfWeek(start_date));
    handleEndDateChange(endOfWeek(start_date));
  },
  "Last Month": ({handleStartDateChange, handleEndDateChange, fiscalYear}) => {
    const date = new Date();
    date.setFullYear(fiscalYear);
    const start_date = subMonths(date, 1);
    handleStartDateChange(startOfMonth(start_date));
    handleEndDateChange(endOfMonth(start_date));
  },
  "Last Quarter": ({
    handleStartDateChange,
    handleEndDateChange,
    fiscalYear,
  }) => {
    const date = new Date();
    date.setFullYear(fiscalYear);
    const start_date = subQuarters(fiscalYear, 1);
    handleStartDateChange(startOfQuarter(start_date));
    handleEndDateChange(endOfQuarter(start_date));
  },
  "Last Year": ({handleStartDateChange, handleEndDateChange, fiscalYear}) => {
    handleStartDateChange(beginningOfFiscalYear(fiscalYear - 1));
    handleEndDateChange(endOfFiscalYear(fiscalYear - 1));
  },
  "Last Week-to-date": ({
    handleStartDateChange,
    handleEndDateChange,
    fiscalYear,
  }) => {
    const date = new Date();
    date.setFullYear(fiscalYear);
    const start_date = subWeeks(date, 1);
    handleStartDateChange(startOfWeek(start_date));
    handleEndDateChange(new Date());
  },
  "Last Month-to-date": ({
    handleStartDateChange,
    handleEndDateChange,
    fiscalYear,
  }) => {
    const date = new Date();
    date.setFullYear(fiscalYear);
    const start_date = subMonths(date, 1);
    handleStartDateChange(startOfMonth(start_date));
    handleEndDateChange(new Date());
  },
  "Last Quarter-to-date": ({
    handleStartDateChange,
    handleEndDateChange,
    fiscalYear,
  }) => {
    const date = new Date();
    date.setFullYear(fiscalYear);
    const start_date = subQuarters(date, 1);
    handleStartDateChange(startOfQuarter(start_date));
    handleEndDateChange(new Date());
  },
  "Last Year-to-date": ({
    handleStartDateChange,
    handleEndDateChange,
    fiscalYear,
  }) => {
    const start_date = beginningOfFiscalYear(fiscalYear - 1);
    handleStartDateChange(startOfYear(start_date));
    handleEndDateChange(new Date());
  },
  "Since 30 Days Ago": ({handleStartDateChange, handleEndDateChange}) => {
    handleStartDateChange(subDays(new Date(), 30));
    handleEndDateChange(new Date());
  },
  "Since 60 Days Ago": ({handleStartDateChange, handleEndDateChange}) => {
    handleStartDateChange(subDays(new Date(), 60));
    handleEndDateChange(new Date());
  },
  "Since 90 Days Ago": ({handleStartDateChange, handleEndDateChange}) => {
    handleStartDateChange(subDays(new Date(), 90));
    handleEndDateChange(new Date());
  },
  "Since 365 Days Ago": ({handleStartDateChange, handleEndDateChange}) => {
    handleStartDateChange(subDays(new Date(), 365));
    handleEndDateChange(new Date());
  },
  "Next Week": ({handleStartDateChange, handleEndDateChange, fiscalYear}) => {
    const date = new Date();
    date.setFullYear(fiscalYear);
    const start_date = addWeeks(startOfWeek(date), 1);
    handleStartDateChange(start_date);
    handleEndDateChange(endOfWeek(start_date));
  },
  "Next 4 Weeks": ({
    handleStartDateChange,
    handleEndDateChange,
    fiscalYear,
  }) => {
    const date = new Date();
    date.setFullYear(fiscalYear);
    const start_date = addWeeks(startOfWeek(fiscalYear), 1);
    handleStartDateChange(start_date);
    handleEndDateChange(endOfWeek(addWeeks(start_date, 3)));
  },
  "Next Month": ({handleStartDateChange, handleEndDateChange, fiscalYear}) => {
    const date = new Date();
    date.setFullYear(fiscalYear);
    const start_date = addMonths(startOfMonth(fiscalYear), 1);
    handleStartDateChange(start_date);
    handleEndDateChange(endOfMonth(start_date));
  },
  "Next Quarter": ({
    handleStartDateChange,
    handleEndDateChange,
    fiscalYear,
  }) => {
    const date = new Date();
    date.setFullYear(fiscalYear);
    const start_date = addQuarters(startOfQuarter(fiscalYear), 1);
    handleStartDateChange(start_date);
    handleEndDateChange(endOfQuarter(start_date));
  },
  "Next Year": ({handleStartDateChange, handleEndDateChange, fiscalYear}) => {
    handleStartDateChange(beginningOfFiscalYear(fiscalYear + 1));
    handleEndDateChange(endOfFiscalYear(fiscalYear + 1));
  },
};

DateSelector.propTypes = {
  value: PropTypes.string,
  fiscalYear: PropTypes.number,
  handleValueChange: PropTypes.func,
  handleStartDateChange: PropTypes.func.isRequired,
  handleEndDateChange: PropTypes.func.isRequired,
};

const beginningOfFiscalYear = (year = new Date().getFullYear()) =>
  toDate(`${year}-07-01`);
const endOfFiscalYear = (year = new Date().getFullYear()) =>
  toDate(`${year + 1}-06-30`);

export default DateSelector
