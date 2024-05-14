/**
 * Date Range Toggle - dropdown with a date field allows before/after/between selections
 */

import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import KeyboardDate from "../reports/shared/keyboard_date";

import {withStyles} from "@material-ui/core/styles";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import produce from "immer";

const DateRangeToggle = ({
  afterDate,
  beforeDate,
  filterType = "Before",
  dateToggleLabel = "Date",
  dateBeforeLabel = "Before",
  dateAfterLabel = "After",
  dateBetweenLabel = "Between",
  handleDateToggleChange = function () {},
  handleStartDateChange = function () {},
  handleEndDateChange = function () {},
  classes = {},
}) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container className={classes.root} spacing={1}>
        <Grid item>
          <TextField
            select
            id="filter-type-toggle"
            name="dateFilter"
            label={dateToggleLabel}
            value={filterType}
            onChange={handleDateToggleChange}
            margin="dense"
            inputProps={{
              className: "browser-default",
            }}
          >
            <MenuItem value="Before">{dateBeforeLabel}</MenuItem>
            <MenuItem value="After">{dateAfterLabel}</MenuItem>
            <MenuItem value="Between">{dateBetweenLabel}</MenuItem>
          </TextField>
        </Grid>
        {filterType !== "Before" && (
          <Grid item>
            <KeyboardDate
              autoOk
              id="start-date"
              name="afterDate"
              variant="inline"
              label=""
              margin="dense"
              value={afterDate || ""}
              onChange={handleStartDateChange}
              inputProps={{
                className: "browser-default",
              }}
            />
          </Grid>
        )}
        {filterType !== "After" && (
          <Grid item>
            <KeyboardDate
              autoOk
              id="end-date"
              name="beforeDate"
              variant="inline"
              label=""
              margin="dense"
              value={beforeDate || ""}
              onChange={handleEndDateChange}
              inputProps={{
                className: "browser-default",
              }}
            />
          </Grid>
        )}
      </Grid>
    </MuiPickersUtilsProvider>
  );
};

DateRangeToggle.propTypes = {
  afterDate: PropTypes.string,
  beforeDate: PropTypes.string,
  filterType: PropTypes.string,
  dateToggleLabel: PropTypes.string,
  dateBeforeLabel: PropTypes.string,
  dateAfterLabel: PropTypes.string,
  dateBetweenLabel: PropTypes.string,
  /* Callbacks */
  handleDateToggleChange: PropTypes.func.isRequired,
  handleStartDateChange: PropTypes.func.isRequired,
  handleEndDateChange: PropTypes.func.isRequired,

  classes: PropTypes.object.isRequired,
};

const styles = () => ({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    flexWrap: "nowrap",
  },
});

export default withStyles(styles)(DateRangeToggle);

// Event Handers
//------------------------------------------------------------------------------

export const reducerActons = {
  setDateToggle: (state, dateFilter) =>
    produce(state, (draft) => {
      if (!state.filter) {
        draft.filter = {};
      }
      if (dateFilter !== "Before") {
        draft.filter.start_date = "";
      } else if (dateFilter !== "After") {
        draft.filter.end_date = "";
      }
      draft.filter.dateFilter = dateFilter;
    }),

  setBeforeDateFilter: (state, end_date) =>
    produce(state, (draft) => {
      if (!state.filter) {
        draft.filter = {};
      }
      if (state.filter.dateFilter === "Before") {
        draft.filter.start_date = "";
      }
      draft.filter.end_date = end_date;
    }),

  setAfterDateFilter: (state, start_date) =>
    produce(state, (draft) => {
      if (!state.filter) {
        draft.filter = {};
      }
      if (state.filter.dateFilter === "After") {
        draft.filter.start_date = "";
      }
      draft.filter.start_date = start_date;
    }),
};

export const eventHandlers = (dispatch, key) => ({
  handleFilterDateToggleChange: ({target: {value}}) => {
    dispatch[key].setDateToggle(value);
  },
  handleBeforeDateFilterChange: (value) => {
    dispatch[key].setBeforeDateFilter(value);
  },
  handleAfterDateFilterChange: (value) => {
    dispatch[key].setAfterDateFilter(value);
  },
});
