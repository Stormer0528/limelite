import PropTypes from "prop-types";
import Toolbar from "@material-ui/core/Toolbar";
import {withStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import DateRangeToggle from "../../../shared/date_range_toggle";
import AmountToggle from "../../../shared/amount_toggle";

const EntriesTableFilter = ({
  classes = {},
  start_date = "",
  end_date = "",
  dateFilter = "",
  entry_type = "",
  aasm_state = "",
  min_amount,
  max_amount,
  amountFilter,
  handleStateFilterChange = function () {},
  handleEntryTypeFilterChange = function () {},
  handleFilterDateToggleChange = function () {},
  handleBeforeDateFilterChange = function () {},
  handleAfterDateFilterChange = function () {},
  handleMaxAmountFilterChange = function () {},
  handleMinAmountFilterChange = function () {},
  handleFilterAmountToggleChange = function () {},
}) => {
  return (
    <Toolbar className={classes.root}>
      <Grid
        container
        className={classes.container}
        spacing={1}
        alignItems="stretch"
        alignContent="space-around"
        justifyContent="center"
        wrap="nowrap"
      >
        <Grid item className={classes.gridItem} style={{minWidth: "8.5em"}}>
          <FormControl fullWidth style={{minWidth: "8em"}}>
            <InputLabel htmlFor="type">Type</InputLabel>
            <Select
              autoWidth
              id="type"
              value={entry_type}
              inputProps={{
                className: "browser-default",
              }}
              onChange={handleEntryTypeFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Transaction">Transaction</MenuItem>
              <MenuItem value="Journal Entry">Journal Entry</MenuItem>
              <MenuItem value="Payroll">Payroll</MenuItem>
              <MenuItem value="Accounts Payable">Accounts Payable</MenuItem>
              <MenuItem value="Accounts Receivable">
                Accounts Receivable
              </MenuItem>
              <MenuItem value="Beginning Balance">Beginning Balance</MenuItem>
              <MenuItem value="Payment">Payment</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid
          item
          className={classes.gridItem}
          style={{minWidth: "6.5em", flexGrow: 1}}
        >
          <FormControl fullWidth style={{minWidth: "6.5em"}}>
            <InputLabel htmlFor="state">State</InputLabel>
            <Select
              autoWidth
              id="state"
              value={aasm_state}
              inputProps={{
                className: "browser-default",
              }}
              onChange={handleStateFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="needs_approval">Needs Approval</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="needs_revision">Needs Revision</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item style={{position: "relative", top: "-0.35em", flexGrow: 2}}>
          <DateRangeToggle
            {...{
              afterDate: start_date,
              beforeDate: end_date,
              filterType: dateFilter,

              handleDateToggleChange: handleFilterDateToggleChange,
              handleStartDateChange: handleAfterDateFilterChange,
              handleEndDateChange: handleBeforeDateFilterChange,
            }}
          />
        </Grid>
        <Grid item style={{position: "relative", top: "-0.35em", flexGrow: 2}}>
          <AmountToggle
            {...{
              min_amount,
              max_amount,
              filterType: amountFilter,
              handleAmountToggleChange: handleFilterAmountToggleChange,
              handleMaxAmountChange: handleMaxAmountFilterChange,
              handleMinAmountChange: handleMinAmountFilterChange,
            }}
          />
        </Grid>
      </Grid>
    </Toolbar>
  );
};

EntriesTableFilter.propTypes = {
  classes: PropTypes.object.isRequired,
  dateFilter: PropTypes.string,
  start_date: PropTypes.string,
  end_date: PropTypes.string,
  entry_type: PropTypes.string,
  journalable_type: PropTypes.string,
  aasm_state: PropTypes.string,
  min_amount: PropTypes.string,
  max_amount: PropTypes.string,
  amountFilter: PropTypes.string,
  handleMaxAmountFilterChange: PropTypes.func.isRequired,
  handleMinAmountFilterChange: PropTypes.func.isRequired,
  handleFilterAmountToggleChange: PropTypes.func.isRequired,
  handleJournalTypeFilterChange: PropTypes.func.isRequired,
  handleStateFilterChange: PropTypes.func.isRequired,
  handleEntryTypeFilterChange: PropTypes.func.isRequired,
  handleFilterDateToggleChange: PropTypes.func.isRequired,
  handleBeforeDateFilterChange: PropTypes.func.isRequired,
  handleAfterDateFilterChange: PropTypes.func.isRequired,
};

const styles = () => ({
  root: {
    overflowX: "auto",
    backgroundColor: "#fcfcfc",
  },
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(4, max-content)",
    justifyContent: "flex-start",
  },
});

export default withStyles(styles)(EntriesTableFilter);
