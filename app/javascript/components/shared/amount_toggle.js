/**
 * Date Range Toggle - dropdown with a date field allows before/after/between selections
 */

import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import {withStyles} from "@material-ui/core/styles";
import NumberFormat from "react-number-format";
import debounce from "lodash/debounce";

import produce from "immer";

const AmountToggle = ({
  min_amount = "",
  max_amount = "",
  filterType = "Min",
  toggleLabel = "Amount",
  maxLabel = "Max",
  minLabel = "Min",
  betweenLabel = "Between",
  handleAmountToggleChange = function() {},
  handleMinAmountChange = function() {},
  handleMaxAmountChange = function() {},
  classes = {},
}) => {
  const minMaxError = parseFloat(min_amount) > parseFloat(max_amount);
  return (
    <Grid container className={classes.root} spacing={1}>
      <Grid item>
        <TextField
          select
          id="filter-type-toggle"
          label={toggleLabel}
          value={filterType}
          onChange={handleAmountToggleChange}
          margin="dense"
          inputProps={{
            name: "amountFilter",
            className: "browser-default",
          }}
        >
          <MenuItem value="Min">{minLabel}</MenuItem>
          <MenuItem value="Max">{maxLabel}</MenuItem>
          <MenuItem value="Between">{betweenLabel}</MenuItem>
        </TextField>
      </Grid>
      {filterType !== "Max" && (
        <Grid item>
          <NumberFormat
            label="Min Amount"
            margin="dense"
            className={classes.inputCell}
            value={min_amount}
            onValueChange={debounce(handleMinAmountChange, 500)}
            inputProps={{className: "browser-default"}}
            customInput={TextField}
            thousandSeparator
            prefix="$"
            decimalScale={2}
            fixedDecimalScale
            fullWidth
            name="minAmount"
            error={minMaxError}
            helperText={minMaxError && "Must be less than Max Amount"}
          />
        </Grid>
      )}
      {filterType !== "Min" && (
        <Grid item>
          <NumberFormat
            name="maxAmount"
            label="Max Amount"
            margin="dense"
            className={classes.inputCell}
            value={max_amount}
            onValueChange={debounce(handleMaxAmountChange, 750)}
            inputProps={{className: "browser-default"}}
            customInput={TextField}
            thousandSeparator
            prefix="$"
            decimalScale={2}
            fixedDecimalScale
            fullWidth
            error={minMaxError}
            helperText={minMaxError && "Must be greater than Min. Amount"}
          />
        </Grid>
      )}
    </Grid>
  );
};

AmountToggle.propTypes = {
  min_amount: PropTypes.string,
  max_amount: PropTypes.string,
  filterType: PropTypes.string,
  toggleLabel: PropTypes.string,
  maxLabel: PropTypes.string,
  minLabel: PropTypes.string,
  betweenLabel: PropTypes.string,
  /* Callbacks */
  handleAmountToggleChange: PropTypes.func.isRequired,
  handleMaxAmountChange: PropTypes.func.isRequired,
  handleMinAmountChange: PropTypes.func.isRequired,

  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    flexWrap: "nowrap",
  },
  inputCell: {
    minWidth: "90px",
  },
});

export default withStyles(styles)(AmountToggle);

// Event Handers
//------------------------------------------------------------------------------

export const reducerActons = {
  setAmountToggle: (state, amountFilter) =>
    produce(state, draft => {
      if (!state.filter) {
        draft.filter = {};
      }
      if (amountFilter !== "Max") {
        draft.filter.max_amount = "";
      } else if (amountFilter !== "Min") {
        draft.filter.min_amount = "";
      }
      draft.filter.amountFilter = amountFilter;
    }),

  setMaxAmountFilter: (state, max_amount) =>
    produce(state, draft => {
      if (!state.filter) {
        draft.filter = {};
      }
      if (state.filter.amountFilter === "Max") {
        draft.filter.max_amount = "";
      }
      draft.filter.max_amount = max_amount;
    }),

  setMinAmountFilter: (state, min_amount) =>
    produce(state, draft => {
      if (!state.filter) {
        draft.filter = {};
      }
      if (state.filter.amountFilter === "Min") {
        draft.filter.max_amount = "";
      }
      draft.filter.min_amount = min_amount;
    }),
};

export const eventHandlers = (dispatch, key) => ({
  handleFilterAmountToggleChange: ({target: {value}}) => {
    dispatch[key].setAmountToggle(value);
  },
  handleMaxAmountFilterChange: ({value}) => {
    dispatch[key].setMaxAmountFilter(value);
  },
  handleMinAmountFilterChange: ({value}) => {
    dispatch[key].setMinAmountFilter(value);
  },
});
